import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';
import { QuestionOperation } from '../enums/questionOperation';
import { NQLType } from '../enums/nqlType';
import { QuestionType } from '../enums/questionType';

export class SubTopicNQLTypeMapping extends Model {
  declare id: number;
  declare identifier: string;
  declare topic: QuestionOperation;
  declare sub_topic_id: string;
  declare question_type: QuestionType;
  declare nql_type: NQLType;
  declare created_by: string;
  declare updated_by: string;
}

SubTopicNQLTypeMapping.init(
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
      unique: true,
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
    nql_type: {
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
    modelName: 'SubTopicNQLTypeMapping',
    tableName: 'sub_topic_nql_type_mapping',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
