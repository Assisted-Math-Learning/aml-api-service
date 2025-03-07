import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';
import { QuestionOperation } from '../enums/questionOperation';
import { QuestionType } from '../enums/questionType';

export class SubTopicHierarchy extends Model {
  declare id: number;
  declare topic: QuestionOperation;
  declare sub_topic_id: string;
  declare class_id: string;
  declare sequence: number;
  declare question_types: { name: QuestionType; sequence: number }[];
  declare include_in_diagnostic: boolean;
  declare board_id?: boolean;
  declare created_by: string;
  declare updated_by: string;
}

SubTopicHierarchy.init(
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
    class_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question_types: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    include_in_diagnostic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    board_id: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'SubTopicHierarchy',
    tableName: 'sub_topic_hierarchy',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
