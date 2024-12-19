import { createAggregateData, findAggregateData, updateAggregateData } from '../../../services/learnerAggregateData';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { Question } from '../../../models/question';
import { QuestionType } from '../../../enums/questionType';
import { LearnerProficiencyQuestionLevelData } from '../../../models/learnerProficiencyQuestionLevelData';
import { Learner } from '../../../models/learner';
import { QuestionOperation } from '../../../enums/questionOperation';

export const getScoreForTheQuestion = (question: Question, learnerResponse: { result?: string; answerTop?: string; quotient?: string; remainder?: string }): number => {
  const { question_type, question_body } = question;
  const { answers, correct_option, numbers, options } = question_body;
  const { result, answerTop, quotient: lrQuotient, remainder: lrRemainder } = learnerResponse;

  let score = 0;

  switch (question_type) {
    case QuestionType.GRID_1:
    case QuestionType.FIB: {
      if (question.operation === QuestionOperation.DIVISION) {
        if (question_type === QuestionType.GRID_1) {
          const quotient = _.get(answers, ['result', 'quotient'], '');
          const remainder = _.get(answers, ['result', 'remainder'], '');
          if (lrQuotient?.toString() === quotient && lrRemainder?.toString() === remainder) {
            score = 1;
          }
        }
        if (question_type === QuestionType.FIB) {
          const fibType = _.get(answers, 'fib_type');
          if (fibType.toString() === '1') {
            const correctAnswer = _.get(answers, ['result'], '');
            if (correctAnswer.toString() === result?.toString()) {
              score = 1;
            }
          }
          if (fibType.toString() === '2') {
            const quotient = _.get(answers, ['result', 'quotient'], '');
            const remainder = _.get(answers, ['result', 'remainder'], '');
            if (quotient === lrQuotient?.toString() && remainder === lrRemainder?.toString()) {
              score = 1;
            }
          }
        }
        break;
      }
      if (answers && answers.result.toString()) {
        const { result: correctAnswer } = answers;
        if (correctAnswer.toString() === result?.toString()) {
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
      const { n1, n2 } = numbers;
      if (numbers && n1 && n2) {
        if ((n1.toString() === answerTop && n2.toString() === result) || (n2.toString() === answerTop && n1.toString() === result)) {
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
  transaction: any,
  learner: Learner,
  reqData: { class_id: string; l1_skill_id: string; total: number; questionsCount: number; sub_skills: { [skillType: string]: number } }[],
) => {
  for (const datum of reqData) {
    const existingEntry = await findAggregateData({ learner_id: learner.identifier, class_id: datum.class_id, l1_skill_id: datum.l1_skill_id });
    if (existingEntry) {
      await updateAggregateData(transaction, existingEntry.identifier, {
        questions_count: datum.questionsCount,
        sub_skills: datum.sub_skills,
        score: +(datum.total / datum.questionsCount).toFixed(2),
        updated_by: learner.identifier,
      });
      continue;
    }
    await createAggregateData(transaction, {
      identifier: uuid.v4(),
      learner_id: learner.identifier,
      taxonomy: learner.taxonomy,
      class_id: datum.class_id,
      l1_skill_id: datum.l1_skill_id,
      questions_count: datum.questionsCount,
      sub_skills: datum.sub_skills,
      score: +(datum.total / datum.questionsCount).toFixed(2),
      created_by: learner.identifier,
    });
  }
};
