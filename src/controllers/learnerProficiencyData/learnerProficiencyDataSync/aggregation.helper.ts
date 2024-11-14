import { createAggregateData, findAggregateData, updateAggregateData } from '../../../services/learnerAggregateData';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { Question } from '../../../models/question';
import { QuestionType } from '../../../enums/questionType';
import { LearnerProficiencyQuestionLevelData } from '../../../models/learnerProficiencyQuestionLevelData';
import { Learner } from '../../../models/learner';

export const getScoreForTheQuestion = (question: Question, learnerResponse: { result: string; answerTop?: string }): number => {
  const { question_type, question_body } = question;
  const { answers, correct_option, numbers, options } = question_body;
  const { result, answerTop } = learnerResponse;

  let score = 0;

  switch (question_type) {
    case QuestionType.GRID_1:
    case QuestionType.FIB: {
      if (answers && answers.result) {
        const { result: correctAnswer } = answers;
        if (correctAnswer.toString() === result.toString()) {
          score = 1;
        }
      }
      break;
    }
    case QuestionType.MCQ: {
      if (correct_option) {
        const correctOptionIndex = +correct_option.split(' ')[1] - 1;
        const correctAnswer = options[correctOptionIndex];
        if (correctAnswer.toString() === result.toString()) {
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

export const getAggregateDataForGivenTaxonomyKey = (
  questionLevelData: LearnerProficiencyQuestionLevelData[],
  taxonomyKey: string,
  isArray = false,
): { [key: string]: { total: number; questionsCount: number; sub_skills: { [skillType: string]: number } } } => {
  // key is the value of the taxonomyKey in the taxonomy object, e.g. => if taxonomyKey is l1_skill, key will be addition
  const resMap: { [key: string]: { total: number; questionsCount: number; sub_skills: { [skillType: number]: number } } } = {};

  const relatedQuestionsMap: { [key: string]: any[] } = {};

  for (const data of questionLevelData) {
    const { taxonomy } = data;
    if (taxonomy && Object.keys(taxonomy || {}).length > 0) {
      if (Object.prototype.hasOwnProperty.call(taxonomy, taxonomyKey)) {
        if (isArray) {
          const dataPoints = (_.get(taxonomy, taxonomyKey) || []).filter((v: any) => !!v);
          for (const datum of dataPoints) {
            const taxonomyKeyValue = _.get(datum, 'identifier');
            if (!Object.prototype.hasOwnProperty.call(resMap, taxonomyKeyValue)) {
              _.set(resMap, taxonomyKeyValue, { total: 0, questionsCount: 0, sub_skills: {} });
            }
            resMap[taxonomyKeyValue].total += data.score;
            resMap[taxonomyKeyValue].questionsCount += 1;
            if (!Object.prototype.hasOwnProperty.call(relatedQuestionsMap, taxonomyKeyValue)) {
              _.set(relatedQuestionsMap, taxonomyKeyValue, []);
            }
            relatedQuestionsMap[taxonomyKeyValue].push(data);
          }
        } else {
          const taxonomyKeyValue = _.get(taxonomy, [taxonomyKey, 'identifier']);
          if (!Object.prototype.hasOwnProperty.call(resMap, taxonomyKeyValue)) {
            _.set(resMap, taxonomyKeyValue, { total: 0, questionsCount: 0, sub_skills: {} });
          }
          resMap[taxonomyKeyValue].total += data.score;
          resMap[taxonomyKeyValue].questionsCount += 1;
          if (!Object.prototype.hasOwnProperty.call(relatedQuestionsMap, taxonomyKeyValue)) {
            _.set(relatedQuestionsMap, taxonomyKeyValue, []);
          }
          relatedQuestionsMap[taxonomyKeyValue].push(data);
        }
      }
    }
  }

  for (const taxonomyKeyValue of Object.keys(relatedQuestionsMap)) {
    const relatedQuestions = relatedQuestionsMap[taxonomyKeyValue];
    resMap[taxonomyKeyValue].sub_skills = calculateSubSkillScoresForQuestionSet(relatedQuestions);
  }

  return resMap;
};

export const aggregateLearnerData = async (
  transaction: any,
  learner: Learner,
  dataKey: 'class_id' | 'l1_skill_id' | 'l2_skill_id' | 'l3_skill_id',
  dataMap: { [key: string]: { total: number; questionsCount: number; sub_skills: { [skillType: string]: number } } },
) => {
  for (const dataKeyValue of Object.keys(dataMap)) {
    const existingEntry = await findAggregateData({ learner_id: learner.identifier, [dataKey]: dataKeyValue });
    if (existingEntry) {
      await updateAggregateData(transaction, existingEntry.identifier, {
        questions_count: dataMap[dataKeyValue].questionsCount,
        sub_skills: dataMap[dataKeyValue].sub_skills,
        score: +(dataMap[dataKeyValue].total / dataMap[dataKeyValue].questionsCount).toFixed(2),
        updated_by: learner.identifier,
      });
      continue;
    }
    await createAggregateData(transaction, {
      identifier: uuid.v4(),
      learner_id: learner.identifier,
      taxonomy: learner.taxonomy,
      [dataKey]: dataKeyValue,
      questions_count: dataMap[dataKeyValue].questionsCount,
      sub_skills: dataMap[dataKeyValue].sub_skills,
      score: +(dataMap[dataKeyValue].total / dataMap[dataKeyValue].questionsCount).toFixed(2),
      created_by: learner.identifier,
    });
  }
};
