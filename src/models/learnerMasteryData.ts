import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';
import { QuestionOperation } from '../enums/questionOperation';
import { QuestionSetPurposeType } from '../enums/questionSetPurposeType';

export class LearnerMasteryData extends Model {
  declare id: number;
  declare learner_id: string;
  declare topic: QuestionOperation;
  declare sub_topic_id: string;
  declare skill_combination_id: string;
  declare mastery_score: number;
  declare accuracy: number;
  declare total_recent_attempts: number;
  declare complexity_score_percentile: number;
  declare max_complexity_score: number;
  declare updated_for_question_set_type: QuestionSetPurposeType;
  declare updated_for_question_set_id: string;
  declare created_by: string;
  declare updated_by: string;
}

LearnerMasteryData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    learner_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_topic_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skill_combination_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mastery_score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    accuracy: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    total_recent_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    complexity_score_percentile: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    max_complexity_score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    updated_for_question_set_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_for_question_set_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: AppDataSource,
    modelName: 'LearnerMasteryData',
    tableName: 'learner_mastery_data',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
