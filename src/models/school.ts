import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class School extends Model {
  declare id: number;
  declare identifier: string;
  declare name: string;
  declare tenant_id: string | null;
  declare board_id: string;
  declare created_by: string;
  declare updated_by: string;
}

School.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenant_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    board_id: {
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
    modelName: 'School',
    tableName: 'school',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
