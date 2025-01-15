import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class SectionMaster extends Model {
  declare id: number;
  declare identifier: string;
  declare section: string;
  declare created_by: string;
  declare updated_by: string;
}

SectionMaster.init(
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
    section: {
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
    modelName: 'SectionMaster',
    tableName: 'section_master',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
