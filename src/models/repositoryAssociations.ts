import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class RepositoryAssociation extends Model {
  declare id: number;
  declare repository_id: string;
  declare tenant_id?: string | null;
  declare board_id?: string | null;
  declare learner_id?: string | null;
  declare sequence: number;
  declare is_active: boolean;
  declare created_by: string;
  declare updated_by?: string | null;
}

RepositoryAssociation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    repository_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenant_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    board_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    learner_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    modelName: 'RepositoryAssociation',
    tableName: 'repository_associations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    comment: 'Table to store repository-association-related data',
  },
);
