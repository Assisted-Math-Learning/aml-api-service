import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class Learner extends Model {
  declare id: number;
  declare identifier: string;
  declare username: string;
  declare password: string;
  declare taxonomy: {
    board: { id: number; name: { [key: string]: string } };
    class: { id: number; name: { [key: string]: string } };
  };
  declare created_by: string;
  declare updated_by: string;
}

Learner.init(
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxonomy: {
      type: DataTypes.JSONB,
      allowNull: false,
      unique: true,
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
    modelName: 'Learner',
    tableName: 'learner',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
