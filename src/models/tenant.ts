import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class Tenant extends Model {
  declare id: number;
  declare identifier: string;
  declare name: { [key: string]: string };
  declare type: { [key: string]: string };
  declare board_id?: number[] | null;
  declare is_active: boolean;
  declare status: 'draft' | 'live';
  declare enable_telemetry: boolean;
  declare created_by: string;
  declare updated_by?: string | null;
}

Tenant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Multilingual field for tenant name',
    },
    type: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Multilingual field for tenant type',
    },
    board_id: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      comment: 'Array of board IDs associated with the tenant',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indicates whether the tenant is active or not',
    },
    enable_telemetry: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indicates whether the telemetry data collection is enabled for tenant or not',
    },
    status: {
      type: DataTypes.ENUM('draft', 'live'),
      allowNull: false,
      defaultValue: 'draft',
      comment: 'The status of the tenant',
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The user who created this tenant',
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'The user who last updated this tenant',
    },
  },
  {
    sequelize: AppDataSource,
    modelName: 'Tenant',
    tableName: 'tenant',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    comment: 'Table to store tenant-related data',
  },
);
