import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class Learner extends Model {
  declare id: number;
  declare identifier: string;
  declare username: string;
  declare password: string;
  declare name: string | null;
  declare taxonomy: {
    board: { identifier: string; name: { [key: string]: string } };
    class: { identifier: string; name: { [key: string]: string } };
  };
  declare tenant_id: string;
  declare board_id: string | null;
  declare school_id: string | null;
  declare class_id: string | null;
  declare section_id: string | null;
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
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    taxonomy: {
      type: DataTypes.JSONB,
      allowNull: false,
      unique: true,
    },
    tenant_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    board_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    school_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    class_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    section_id: {
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
