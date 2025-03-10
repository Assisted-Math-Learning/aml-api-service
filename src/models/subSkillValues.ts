import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class SubSkillValues extends Model {
  declare id: number;
  declare identifier: string;
  declare sub_skill_id: string;
  declare skill_value_name?: string;
  declare sequence: number;
  declare created_by: string;
  declare updated_by?: string | null;
}

SubSkillValues.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    sub_skill_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skill_value_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sequence: {
      type: DataTypes.INTEGER,
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
    modelName: 'SubSkillValues',
    tableName: 'sub_skill_values',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    comment: 'Table to store sub-skill related data',
  },
);
