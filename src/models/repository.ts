import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class Repository extends Model {
  declare id: number;
  declare name: { [key: string]: string };
  declare identifier: string;
  declare description?: { [key: string]: string } | null;
  declare status: 'draft' | 'live';
  declare is_active: boolean;
  declare created_by: string;
  declare updated_by?: string | null; // Optional field
}

Repository.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Multilingual field for repository name',
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Unique identifier for the repository',
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Description of the repository in multiple languages',
    },
    status: {
      type: DataTypes.ENUM('draft', 'live'),
      allowNull: false,
      comment: 'Current status of the repository',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indicates whether the repository is active',
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'User who created the repository',
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User who last updated the repository',
    },
  },
  {
    sequelize: AppDataSource,
    modelName: 'Repository',
    tableName: 'repository',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    comment: 'Table to store repository-related data',
  },
);
