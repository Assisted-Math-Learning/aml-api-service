import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';
import { LearnerJourneyStatus } from '../enums/learnerJourneyStatus';

export class LearnerJourney extends Model {
  declare id: number;
  declare identifier: string;
  declare learner_id: string;
  declare question_set_id: string;
  declare completed_question_ids: string[];
  declare status: LearnerJourneyStatus;
  declare start_time: Date;
  declare end_time: Date;
  declare attempts_count: number;
  declare created_by: string;
  declare updated_by: string;
}

LearnerJourney.init(
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
    question_set_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed_question_ids: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: LearnerJourneyStatus.IN_PROGRESS,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    attempts_count: {
      type: DataTypes.NUMBER,
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
    modelName: 'LearnerJourney',
    tableName: 'learner_journey',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
