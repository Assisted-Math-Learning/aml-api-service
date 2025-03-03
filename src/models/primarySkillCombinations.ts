import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';
import { QuestionOperation } from '../enums/questionOperation';

export class PrimarySkillCombinations extends Model {
  declare id: number;
  declare identifier: string;
  declare topic: QuestionOperation;
  declare sub_topic_id: string;
  declare priority_level: number;
  declare level: number[];
  declare sub_skill_value_ids: string[];
  declare created_by: string;
  declare updated_by: string;
}

PrimarySkillCombinations.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
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
    priority_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    sub_skill_value_ids: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
    modelName: 'PrimarySkillCombinations',
    tableName: 'primary_skill_combinations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
