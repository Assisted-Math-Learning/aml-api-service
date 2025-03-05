import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class SubTopicMaster extends Model {
  declare id: number;
  declare identifier: string;
  declare name: string;
  declare created_by: string;
  declare updated_by: string;
}

SubTopicMaster.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
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
    modelName: 'SubTopicMaster',
    tableName: 'sub_topic_master',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
