import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class AudioQuestionMapping extends Model {
  declare id: number;
  declare question_id: string;
  declare audio_id: string;
  declare language: string;
  declare created_by: string;
  declare updated_by: string;
}

AudioQuestionMapping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    audio_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
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
  },
  {
    sequelize: AppDataSource,
    modelName: 'AudioQuestionMapping',
    tableName: 'audio_question_mapping',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
