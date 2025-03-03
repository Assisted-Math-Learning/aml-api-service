import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class QuestionMeta extends Model {
  declare id: number;
  declare question_x_id: string;
  declare meta: {
    complexity_score: number;
    sub_topic_ids: string[];
  };
  declare created_by: string;
  declare updated_by: string;
}

QuestionMeta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    question_x_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    meta: {
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
    modelName: 'QuestionMeta',
    tableName: 'question_meta',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
