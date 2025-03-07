import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';
import { QuestionOperation } from '../enums/questionOperation';
import { QuestionType } from '../enums/questionType';

export class AccuracyThresholds extends Model {
  declare id: number;
  declare topic: QuestionOperation;
  declare sub_topic_id: string;
  declare question_type: QuestionType;
  declare threshold: any;
  declare created_by: string;
  declare updated_by: string;
}

AccuracyThresholds.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_topic_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    threshold: {
      type: DataTypes.JSONB,
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
    modelName: 'AccuracyThresholds',
    tableName: 'accuracy_thresholds',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
