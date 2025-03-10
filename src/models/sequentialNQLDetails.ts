import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class SequentialNQLDetails extends Model {
  declare id: number;
  declare nql_type_mapping_id: string;
  declare class_id: string;
  declare question_set_x_id: string;
  declare sequence: number;
  declare created_by: string;
  declare updated_by: string;
}

SequentialNQLDetails.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nql_type_mapping_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question_set_x_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sequence: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    modelName: 'SequentialNQLDetails',
    tableName: 'sequential_nql_details',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
