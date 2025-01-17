import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class QuestionSetQuestionMapping extends Model {
  declare id: number;
  declare question_set_id: string;
  declare question_id: string;
  declare sequence: number;
  declare created_by: string;
  declare updated_by?: string;
}

QuestionSetQuestionMapping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question_set_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
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
  },
  {
    sequelize: AppDataSource,
    modelName: 'QuestionSetQuestionMapping',
    tableName: 'question_set_question_mapping',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
  },
);
