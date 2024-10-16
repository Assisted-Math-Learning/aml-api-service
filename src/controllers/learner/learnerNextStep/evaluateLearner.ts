import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../../utils/responseHandler';
import logger from '../../../utils/logger';
import { amlError } from '../../../types/amlError';
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

const evaluateLearner = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const learner_id = _.get(req, 'params.learner_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const learner = (req as any).learner;

  if (learner.identifier !== learner_id) {
    const code = 'LEARNER_DOES_NOT_EXIST';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Learner does not exist' });
    throw amlError(code, 'Learner does not exist', 'NOT_FOUND', 404);
  }

  const { learnerJourney } = await readLearnerJourney(learner_id);

  /**
   * Check if learner is attempting a question_set
   */
  if (learnerJourney && learnerJourney.status === LearnerJourneyStatus.IN_PROGRESS) {
    const code = 'LEARNER_JOURNEY_IN_PROGRESS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Learner Journey already in progress` });
    throw amlError(code, `Learner Journey already in progress`, 'BAD_REQUEST', 400);
  }

  const learnerBoardId = _.get(learner, ['taxonomy', 'board', 'id']);
  const learnerClassId = _.get(learner, ['taxonomy', 'class', 'id']);

  /**
   * Validate learner board
   */
  const boardEntity: boardMaster = await getEntitySearch({ entityType: 'board', filters: { id: learnerBoardId } });
  if (!boardEntity) {
    const code = 'LEARNER_BOARD_NOT_FOUND';
    logger.error({ code, apiId, msgid, resmsgid, message: `Learner Board: ${learnerBoardId} does not exist` });
    throw amlError(code, `Learner Board: ${learnerBoardId} does not exist`, 'NOT_FOUND', 404);
  }

  /**
   * Validate learner class
   */
  const classEntity: classMaster = await getEntitySearch({ entityType: 'class', filters: { id: learnerClassId } });
  if (!classEntity) {
    const code = 'LEARNER_CLASS_NOT_FOUND';
    logger.error({ code, apiId, msgid, resmsgid, message: `Learner Class: ${learnerClassId} does not exist` });
    throw amlError(code, `Learner Class: ${learnerClassId} does not exist`, 'NOT_FOUND', 404);
  }

  const class_ids = (boardEntity?.class_ids || []).sort((a, b) => a.sequence_no - b.sequence_no);

  const currentGradeIndex = class_ids.findIndex((datum) => datum.id === classEntity.identifier);
  const highestApplicableGradeMapping = class_ids[currentGradeIndex - 1] as { id: string; l1_skill_ids: string[] };
  const highestApplicableGrade = (await getEntitySearch({ entityType: 'class', filters: { identifier: highestApplicableGradeMapping.id } })) as classMaster;
  const requiredL1SkillsIds = highestApplicableGradeMapping.l1_skill_ids;
  const requiredL1Skills = await fetchSkillsByIds(requiredL1SkillsIds);

  let questionSetId: string = '';

  for (const skillEntity of requiredL1Skills) {
    const { id: skillId, identifier } = skillEntity;
    const allApplicableGradeIds = class_ids.reduce((agg: string[], curr) => {
      if (curr.l1_skill_ids.includes(identifier)) {
        agg.push(curr.id);
      }
      return agg;
    }, []);

    const allApplicableGradeEntities: classMaster[] = await getEntitySearch({ entityType: 'class', filters: { identifier: allApplicableGradeIds } });
    const allApplicableGrades = allApplicableGradeEntities.map((grade) => grade.id);
    /**
     * If not a fresh user
     */
    if (learnerJourney) {
      const learnerJourneyQuestionSet = await getQuestionSetById(learnerJourney.question_set_id);
      if (learnerJourneyQuestionSet!.purpose !== QuestionSetPurposeType.MAIN_DIAGNOSTIC && learnerJourneyQuestionSet!.taxonomy.l1_skill.id === skillId) {
        const nextPracticeQuestionSet = await getNextPracticeQuestionSetInSequence({
          boardId: learnerJourneyQuestionSet!.taxonomy.board.id,
          classIds: allApplicableGrades,
          l1SkillId: learnerJourneyQuestionSet!.taxonomy.l1_skill.id,
          lastSetSequence: learnerJourneyQuestionSet!.sequence,
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
    const mainDiagnosticQS = await getMainDiagnosticQuestionSet({ boardId: learnerBoardId, classId: highestApplicableGrade.id, l1SkillId: skillId });
    const { learnerJourney: learnerJourneyForMDQS } = await readLearnerJourneyByLearnerIdAndQuestionSetId(learner_id, mainDiagnosticQS.identifier);
    if (_.isEmpty(learnerJourneyForMDQS)) {
      questionSetId = mainDiagnosticQS.identifier;
      break;
    }

    let lowestApplicableGradeForPractice = -1;
    for (const grade of allApplicableGrades) {
      const learnerAggregateData = await findAggregateData({ learner_id, class_id: grade });
      if (learnerAggregateData && learnerAggregateData?.score < PASSING_MARKS) {
        lowestApplicableGradeForPractice = grade;
        break;
      }
    }

    if (lowestApplicableGradeForPractice) {
      const practiceQuestionSet = await getPracticeQuestionSet({ boardId: learnerBoardId, classId: lowestApplicableGradeForPractice, l1SkillId: skillId });
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

export default evaluateLearner;
