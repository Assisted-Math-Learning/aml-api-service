import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';
import { Taxonomy } from '../types/taxonomy';

export class LearnerProficiencyQuestionLevelData extends Model {
  declare id: number;
  declare identifier: string;
  declare learner_id: string;
  declare question_id: string;
  declare question_set_id: string;
  declare taxonomy: Taxonomy;
  declare sub_skills: { [skillId: number]: number };
  declare learner_response: { result?: string; answerTop?: string; answerBottom?: string; quotient?: string; remainder?: string };
  declare score: number;
  declare attempts_count: number;
  declare created_by: string;
  declare updated_by: string;
  declare created_at: Date;
  declare updated_at: Date;
}

LearnerProficiencyQuestionLevelData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    learner_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question_set_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxonomy: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    sub_skills: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    learner_response: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    score: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    attempts_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: AppDataSource,
    modelName: 'LearnerProficiencyQuestionLevelData',
    tableName: 'learner_proficiency_question_level_data',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
