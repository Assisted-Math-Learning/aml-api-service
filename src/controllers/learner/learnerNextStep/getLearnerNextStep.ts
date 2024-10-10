import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../../utils/responseHandler';
import logger from '../../../utils/logger';
import { amlError } from '../../../types/amlError';
import { apiId } from '../../LearnerJourneyUpdate/learnerJourneyUpdate';
import { getEntitySearch } from '../../../services/master';
import { readLearnerJourney, readLearnerJourneyByLearnerIdAndQuestionSetId } from '../../../services/learnerJourney';
import { LearnerJourneyStatus } from '../../../enums/learnerJourneyStatus';
import { getMainDiagnosticQuestionSet, getNextPracticeQuestionSetInSequence, getPracticeQuestionSet, getQuestionSetById } from '../../../services/questionSet';
import { findAggregateData } from '../../../services/learnerAggregateData';
import { PASSING_MARKS } from '../../../constants/constants';
import { QuestionSetPurposeType } from '../../../enums/questionSetPurposeType';
import { boardMaster } from '../../../models/boardMaster';
import { classMaster } from '../../../models/classMaster';
import { fetchSkillsByIds } from '../../../services/skill';

const getLearnerNextStep = async (req: Request, res: Response) => {
  const learner_id = _.get(req, 'params.learner_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  // TODO: validate learner_id & get their board & class

  const { learnerJourney } = await readLearnerJourney(learner_id);

  /**
   * Check if learner is attempting a question_set
   */
  if (learnerJourney && learnerJourney.status === LearnerJourneyStatus.IN_PROGRESS) {
    const code = 'LEARNER_JOURNEY_IN_PROGRESS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Learner Journey already in progress` });
    throw amlError(code, `Learner Journey already in progress`, 'BAD_REQUEST', 400);
  }

  // TODO: replace with valid values
  const learnerBoard = 'CBSE';
  const learnerClass = 'Class 5';

  /**
   * Validate learner board
   */
  const boardEntity: boardMaster = await getEntitySearch({ entityType: 'board', filters: { name: [{ en: learnerBoard }] } });
  if (!boardEntity) {
    const code = 'LEARNER_BOARD_NOT_FOUND';
    logger.error({ code, apiId, msgid, resmsgid, message: `Learner Board: ${learnerBoard} does not exist` });
    throw amlError(code, `Learner Board: ${learnerBoard} does not exist`, 'NOT_FOUND', 404);
  }

  /**
   * Validate learner class
   */
  const classEntity: classMaster = await getEntitySearch({ entityType: 'class', filters: { name: [{ en: learnerBoard }] } });
  if (!classEntity) {
    const code = 'LEARNER_CLASS_NOT_FOUND';
    logger.error({ code, apiId, msgid, resmsgid, message: `Learner Class: ${learnerClass} does not exist` });
    throw amlError(code, `Learner Class: ${learnerClass} does not exist`, 'NOT_FOUND', 404);
  }

  const class_ids = (boardEntity?.class_ids || []).sort((a, b) => a.sequence_no - b.sequence_no);

  const currentGradeIndex = class_ids.findIndex((datum) => datum.id === classEntity.identifier);
  const highestApplicableGradeMapping = class_ids[currentGradeIndex - 1] as { id: string; l1_skill_ids: string[] };
  const highestApplicableGrade = await getEntitySearch({ entityType: 'class', filters: { identifier: highestApplicableGradeMapping.id } });
  const requiredL1SkillsIds = highestApplicableGradeMapping.l1_skill_ids;
  const requiredL1Skills = await fetchSkillsByIds(requiredL1SkillsIds);

  let questionSetId: string = '';

  for (const skillEntity of requiredL1Skills) {
    const {
      name: { en: skill },
      identifier,
    } = skillEntity;
    const allApplicableGradeIds = class_ids.reduce((agg: string[], curr) => {
      if (curr.l1_skill_ids.includes(identifier)) {
        agg.push(curr.id);
      }
      return agg;
    }, []);

    const allApplicableGradeEntities: classMaster[] = await getEntitySearch({ entityType: 'class', filters: { identifier: allApplicableGradeIds } });
    const allApplicableGrades = allApplicableGradeEntities.map((grade) => grade.name.en);
    /**
     * If not a fresh user
     */
    if (learnerJourney) {
      const learnerJourneyQuestionSet = await getQuestionSetById(learnerJourney.question_set_id);
      if (learnerJourneyQuestionSet.purpose !== QuestionSetPurposeType.MAIN_DIAGNOSTIC && learnerJourneyQuestionSet.taxonomy.l1_skill === skill) {
        const nextPracticeQuestionSet = await getNextPracticeQuestionSetInSequence({
          board: learnerJourneyQuestionSet.taxonomy.board,
          classes: allApplicableGrades,
          l1Skill: learnerJourneyQuestionSet.taxonomy.l1_skill,
          lastSetSequence: learnerJourneyQuestionSet.sequence,
        });

        if (nextPracticeQuestionSet) {
          questionSetId = nextPracticeQuestionSet.identifier;
          break;
        }
      }
    }

    /**
     * if a fresh user OR
     * last attempted question set purpose is MD OR
     * no more practice question sets are available for the current skill
     */
    const mainDiagnosticQS = await getMainDiagnosticQuestionSet({ board: learnerBoard, class: highestApplicableGrade, l1Skill: skill });
    const { learnerJourney: learnerJourneyForMDQS } = await readLearnerJourneyByLearnerIdAndQuestionSetId(learner_id, mainDiagnosticQS.identifier);
    if (_.isEmpty(learnerJourneyForMDQS)) {
      questionSetId = mainDiagnosticQS.identifier;
      break;
    }

    let lowestApplicableGradeForPractice = '';
    for (const grade of allApplicableGrades) {
      const learnerAggregateData = await findAggregateData({ learner_id, class: grade });
      if (learnerAggregateData && learnerAggregateData?.score < PASSING_MARKS) {
        lowestApplicableGradeForPractice = grade;
        break;
      }
    }

    if (lowestApplicableGradeForPractice) {
      const practiceQuestionSet = await getPracticeQuestionSet({ board: learnerBoard, class: lowestApplicableGradeForPractice, l1Skill: skill });
      if (practiceQuestionSet) {
        questionSetId = practiceQuestionSet.identifier;
        break;
      }
    }
  }

  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: { message: questionSetId ? 'Learner next step fetched successfully' : 'No more practice questions available', data: { question_set_id: questionSetId ?? '' } },
  });
};

export default getLearnerNextStep;
