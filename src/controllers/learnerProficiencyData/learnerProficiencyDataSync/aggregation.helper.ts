import { bulkCreateAggregateData, bulkFindAggregateData, updateAggregateData } from '../../../services/learnerAggregateData';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { Question } from '../../../models/question';
import { QuestionType } from '../../../enums/questionType';
import { LearnerProficiencyQuestionLevelData } from '../../../models/learnerProficiencyQuestionLevelData';
import { Learner } from '../../../models/learner';
import { QuestionOperation } from '../../../enums/questionOperation';
import { FIBType } from '../../../enums/fibType';
import { replaceLeadingZeroes } from '../../../utils/string.util';
import { Transaction } from 'sequelize';

export const getScoreForTheQuestion = (question: Question, learnerResponse: { result?: string; quotient?: string; remainder?: string; answerTopRow?: string; answerBottomRow?: string }): number => {
  const { question_type, question_body } = question;
  const { answers, correct_option, numbers, options } = question_body;
  const { result, quotient: lrQuotient, remainder: lrRemainder, answerTopRow, answerBottomRow } = learnerResponse;

  let score = 0;

  switch (question_type) {
    case QuestionType.GRID_1: {
      if (question.operation === QuestionOperation.DIVISION) {
        const quotient = _.get(answers, ['result', 'quotient'], '');
        const remainder = _.get(answers, ['result', 'remainder'], '');
        if (lrQuotient?.toString() === quotient.toString() && lrRemainder?.toString() === remainder?.toString()) {
          score = 1;
        }
      } else if (answers && answers.result.toString()) {
        const correctAnswer = _.get(answers, ['result'], '');
        if (correctAnswer.toString() === result?.toString()) {
          score = 1;
        }
      }
      break;
    }
    case QuestionType.FIB: {
      const fibType = _.get(answers, 'fib_type');
      if ([FIBType.FIB_STANDARD, FIBType.FIB_STANDARD_WITH_IMAGE].includes(fibType)) {
        const correctAnswer = _.get(answers, ['result'], '');
        if (replaceLeadingZeroes(correctAnswer.toString()) === replaceLeadingZeroes(result?.toString())) {
          score = 1;
        }
      }
      if ([FIBType.FIB_QUOTIENT_REMAINDER, FIBType.FIB_QUOTIENT_REMAINDER_WITH_IMAGE].includes(fibType)) {
        const quotient = _.get(answers, ['result', 'quotient'], '');
        const remainder = _.get(answers, ['result', 'remainder'], '');
        if (
          replaceLeadingZeroes(quotient?.toString()) === replaceLeadingZeroes(lrQuotient?.toString()) &&
          replaceLeadingZeroes(remainder?.toString()) === replaceLeadingZeroes(lrRemainder?.toString())
        ) {
          score = 1;
        }
      }
      break;
    }
    case QuestionType.MCQ: {
      if (correct_option) {
        const correctOptionIndex = +correct_option.split(' ')[1] - 1;
        const correctAnswer = options[correctOptionIndex];
        if (correctAnswer.toString() === result?.toString()) {
          score = 1;
        }
      }
      break;
    }
    case QuestionType.GRID_2: {
      const { operation } = question;
      const { n1, n2 } = numbers;
      if (numbers && n1 && n2 && answerTopRow && answerBottomRow) {
        if (
          operation === QuestionOperation.ADDITION &&
          ((n1.toString() === answerTopRow?.toString() && n2.toString() === answerBottomRow?.toString()) ||
            (n2.toString() === answerTopRow?.toString() && n1.toString() === answerBottomRow?.toString()))
        ) {
          score = 1;
        }
        if (operation === QuestionOperation.SUBTRACTION && n1.toString() === answerTopRow?.toString() && n2.toString() === answerBottomRow?.toString()) {
          score = 1;
        }
      }
      break;
    }
  }
  return score;
};

export const calculateSubSkillScoresForQuestion = (question: Question, learnerResponse: { result: string; answerTop?: string }): { [skillIdentifier: string]: number } => {
  const { question_body } = question;
  const subSkillScoreMap: { [skillIdentifier: string]: number } = {};

  const subSkillsNameIdMap: { [skillName: string]: number } = {};

  for (const subSkill of question.sub_skills || []) {
    if (!subSkill) {
      continue;
    }
    _.set(subSkillsNameIdMap, subSkill.name.en, subSkill.identifier);
  }

  if (question_body) {
    const wrongAnswers = question_body.wrong_answer || [];
    for (const wrongAnswer of wrongAnswers) {
      if (wrongAnswer.value.includes(+learnerResponse.result)) {
        const subSkillId = _.get(subSkillsNameIdMap, wrongAnswer.subskillname);
        _.set(subSkillScoreMap, subSkillId, 0);
      }
    }
  }

  /**
   * Giving full score for remaining sub-skills
   */
  const subSkills = question?.sub_skills || [];
  if (subSkills.length) {
    for (const subSkill of subSkills) {
      const subSkillId = subSkill.identifier;
      if (!_.get(subSkillScoreMap, subSkillId, undefined)) {
        _.set(subSkillScoreMap, subSkillId, 1);
      }
    }
  }

  return subSkillScoreMap;
};

export const calculateAverageScoreForGivenSubSkill = (questionLevelData: LearnerProficiencyQuestionLevelData[], subSkillId: string): number => {
  let totalScore = 0;
  let totalQuestions = 0;

  for (const data of questionLevelData) {
    const subSkills = (data?.sub_skills || {}) as { [skillId: number]: number };
    if (_.get(subSkills, subSkillId)) {
      totalScore += _.get(subSkills, subSkillId);
      totalQuestions++;
    }
  }

  return +(totalScore / totalQuestions).toFixed(2);
};

export const calculateSubSkillScoresForQuestionSet = (questionLevelData: LearnerProficiencyQuestionLevelData[]): { [skillIdentifier: string]: number } => {
  const subSkillScoreMap: { [skillId: number]: number } = {};

  let allRelatedSubSkillIds: string[] = [];

  for (const data of questionLevelData) {
    allRelatedSubSkillIds = [...allRelatedSubSkillIds, ...Object.keys(data?.sub_skills || {})];
  }

  allRelatedSubSkillIds = _.uniq(allRelatedSubSkillIds);

  for (const subSkillId of allRelatedSubSkillIds) {
    const score = calculateAverageScoreForGivenSubSkill(questionLevelData, subSkillId);
    _.set(subSkillScoreMap, subSkillId, score);
  }

  return subSkillScoreMap;
};

export const calculateAverageScoreForQuestionSet = (questionLevelData: LearnerProficiencyQuestionLevelData[]): number => {
  let totalScore = 0;

  for (const data of questionLevelData) {
    totalScore += data.score;
  }

  return +(totalScore / questionLevelData.length).toFixed(2);
};

export const getLearnerAggregateDataForClassAndL1SkillPair = (
  questionLevelData: LearnerProficiencyQuestionLevelData[],
): { class_id: string; l1_skill_id: string; total: number; questionsCount: number; sub_skills: { [skillType: string]: number } }[] => {
  const response: { class_id: string; l1_skill_id: string; total: number; questionsCount: number; sub_skills: { [skillType: string]: number } }[] = [];

  const map: { [classId__l1SkillId: string]: LearnerProficiencyQuestionLevelData[] } = {};

  for (const data of questionLevelData) {
    const key = `${data.taxonomy.class.identifier}__${data.taxonomy.l1_skill.identifier}`;
    if (!Object.prototype.hasOwnProperty.call(map, key)) {
      map[key] = [];
    }
    map[key].push(data);
  }

  Object.entries(map).forEach(([classId__l1SkillId, questionsData]) => {
    const [classId, l1SkillId] = classId__l1SkillId.split('__');
    const totalScore = _.sum(questionsData.map((data) => data.score));
    const questionsCount = questionsData.length;
    const subSkillScores = calculateSubSkillScoresForQuestionSet(questionsData);
    response.push({
      class_id: classId,
      l1_skill_id: l1SkillId,
      questionsCount,
      total: totalScore,
      sub_skills: subSkillScores,
    });
  });

  return response;
};

export const aggregateLearnerData = async (
  transaction: Transaction,
  learner: Learner,
  reqData: { class_id: string; l1_skill_id: string; total: number; questionsCount: number; sub_skills: { [skillType: string]: number } }[],
) => {
  const queryData = reqData.map((datum) => ({ learner_id: learner.identifier, class_id: datum.class_id, l1_skill_id: datum.l1_skill_id }));
  const existingEntries = await bulkFindAggregateData(queryData);
  const existingEntriesMap: any = existingEntries.reduce((agg: any, curr) => {
    const key = `${curr.class_id}_${curr.l1_skill_id}`;
    agg[key] = curr;
    return agg;
  }, {});
  const bulkCreateData = [];
  const bulkUpdateData = [];
  for (const datum of reqData) {
    const key = `${datum.class_id}_${datum.l1_skill_id}`;
    const existingEntry = existingEntriesMap[key];
    const score = +(datum.total / datum.questionsCount).toFixed(2);
    if (existingEntry && existingEntry.score !== score) {
      bulkUpdateData.push({
        identifier: existingEntry.identifier,
        questions_count: datum.questionsCount,
        sub_skills: datum.sub_skills,
        score,
        updated_by: learner.identifier,
      });
      continue;
    }
    bulkCreateData.push({
      identifier: uuid.v4(),
      learner_id: learner.identifier,
      taxonomy: {
        board_id: learner.board_id,
        class_id: learner.class_id,
      },
      class_id: datum.class_id,
      l1_skill_id: datum.l1_skill_id,
      questions_count: datum.questionsCount,
      sub_skills: datum.sub_skills,
      score: +(datum.total / datum.questionsCount).toFixed(2),
      created_by: learner.identifier,
    });
  }
  await bulkCreateAggregateData(transaction, bulkCreateData);
  if (bulkUpdateData.length) {
    await updateAggregateData(transaction, bulkUpdateData);
  }
};
