import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class AudioMaster extends Model {
  declare id: number;
  declare identifier: string;
  declare description_hash: string;
  declare audio_path: string;
  declare language: string;
  declare created_by: string;
}

AudioMaster.init(
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
    description_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    audio_path: {
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
    modelName: 'AudioMaster',
    tableName: 'audio_master',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
