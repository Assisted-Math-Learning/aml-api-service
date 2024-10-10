import { createAggregateData, findAggregateData, updateAggregateData } from '../../../services/learnerAggregateData';
import * as _ from 'lodash';
import * as uuid from 'uuid';

export const calculateSubSkillScoresForQuestion = (question: any, learnerResponse: number): { [skillType: string]: number } => {
  const { question_body } = question;
  const subSkillScoreMap: { [skillType: string]: number } = {};
  if (question_body) {
    const wrongAnswers = (question_body.wrongAnswers || []) as { option: number; subSkill: string[] }[];
    for (const wrongAnswer of wrongAnswers) {
      if (wrongAnswer.option === learnerResponse) {
        wrongAnswer.subSkill.forEach((subSkill) => _.set(subSkillScoreMap, subSkill, 0));
      }
    }
  }

  /**
   * Giving full score for remaining sub-skills
   */
  const subSkills = (question?.sub_skills || []) as { name: { en: string } }[];
  if (subSkills.length) {
    for (const subSkill of subSkills) {
      const skillName = subSkill.name.en;
      if (!_.get(subSkillScoreMap, skillName, undefined)) {
        _.set(subSkillScoreMap, skillName, 1);
      }
    }
  }

  return subSkillScoreMap;
};

export const calculateAverageScoreForGivenSubSkill = (questionLevelData: any[], subSkill: string): number => {
  let totalScore = 0;
  let totalQuestions = 0;

  for (const data of questionLevelData) {
    const subSkills = (data?.sub_skills || {}) as { [skillName: string]: number };
    if (_.get(subSkills, subSkill)) {
      totalScore += _.get(subSkills, subSkill);
      totalQuestions++;
    }
  }

  return +(totalScore / totalQuestions).toFixed(2);
};

export const calculateSubSkillScoresForQuestionSet = (questionLevelData: any[]): { [skillType: string]: number } => {
  const subSkillScoreMap: { [skillType: string]: number } = {};

  let allRelatedSubSkills: string[] = [];

  for (const data of questionLevelData) {
    allRelatedSubSkills = [...allRelatedSubSkills, ...Object.keys(data?.sub_skills || {})];
  }

  allRelatedSubSkills = _.uniq(allRelatedSubSkills);

  for (const subSkill of allRelatedSubSkills) {
    const score = calculateAverageScoreForGivenSubSkill(questionLevelData, subSkill);
    _.set(subSkillScoreMap, subSkill, score);
  }

  return subSkillScoreMap;
};

export const calculateAverageScoreForQuestionSet = (questionLevelData: any[]): number => {
  let totalScore = 0;

  for (const data of questionLevelData) {
    totalScore += data.score;
  }

  return +(totalScore / questionLevelData.length).toFixed(2);
};

export const getAggregateDataForGivenTaxonomyKey = (
  questionLevelData: any[],
  taxonomyKey: string,
): { [key: string]: { total: number; questionsCount: number; sub_skills: { [skillType: string]: number } } } => {
  // key is the value of the taxonomyKey in the taxonomy object, e.g. => if taxonomyKey is l1_skill, key will be addition
  const resMap: { [key: string]: { total: number; questionsCount: number; sub_skills: { [skillType: string]: number } } } = {};

  const relatedQuestionsMap: { [key: string]: any[] } = {};

  for (const data of questionLevelData) {
    const { taxonomy } = data;
    if (taxonomy && Object.keys(taxonomy || {}).length > 0) {
      if (Object.prototype.hasOwnProperty.call(taxonomy, taxonomyKey)) {
        const taxonomyKeyValue = _.get(taxonomy, taxonomyKey);
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

  for (const taxonomyKeyValue of Object.keys(relatedQuestionsMap)) {
    const relatedQuestions = relatedQuestionsMap[taxonomyKeyValue];
    resMap[taxonomyKeyValue].sub_skills = calculateSubSkillScoresForQuestionSet(relatedQuestions);
  }

  return resMap;
};

export const aggregateLearnerData = async (
  learnerId: string,
  dataKey: string,
  dataMap: { [key: string]: { total: number; questionsCount: number; sub_skills: { [skillType: string]: number } } },
  board: string,
) => {
  for (const dataKeyValue of Object.keys(dataMap)) {
    const existingEntry = await findAggregateData({ learner_id: learnerId, [dataKey]: dataKeyValue });
    if (existingEntry) {
      await updateAggregateData(existingEntry.identifier, {
        questions_count: dataMap[dataKeyValue].questionsCount,
        sub_skills: dataMap[dataKeyValue].sub_skills,
        score: +(dataMap[dataKeyValue].total / dataMap[dataKeyValue].questionsCount).toFixed(2),
      });
      continue;
    }
    await createAggregateData({
      identifier: uuid.v4(),
      learner_id: learnerId,
      taxonomy: { board },
      [dataKey]: dataKeyValue,
      questions_count: dataMap[dataKeyValue].questionsCount,
      sub_skills: dataMap[dataKeyValue].sub_skills,
      score: +(dataMap[dataKeyValue].total / dataMap[dataKeyValue].questionsCount).toFixed(2),
      created_by: uuid.v4(), // TODO: replace with valid user id
    });
  }
};
