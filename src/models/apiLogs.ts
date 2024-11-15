import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class ApiLogs extends Model {
  declare id: number;
  declare request_type: string;
  declare learner_id: string;
  declare request_body: any;
  declare error_body: any;
}

ApiLogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    request_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    learner_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    request_body: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    error_body: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize: AppDataSource,
    modelName: 'ApiLogs',
    tableName: 'api_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
