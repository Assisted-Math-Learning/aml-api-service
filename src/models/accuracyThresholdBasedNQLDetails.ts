import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class AccuracyThresholdBasedNQLDetails extends Model {
  declare id: number;
  declare nql_type_mapping_id: string;
  declare num_of_questions_to_give: number;
  declare created_by: string;
  declare updated_by: string;
}

AccuracyThresholdBasedNQLDetails.init(
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
    num_of_questions_to_give: {
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
    modelName: 'AccuracyThresholdBasedNQLDetails',
    tableName: 'accuracy_threshold_based_nql_details',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
