import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

// Define interfaces for the structures used in the QuestionSet
interface Skill {
  id: number;
  name: { [key: string]: string };
}

interface Class {
  id: number;
  name: { [key: string]: string };
}

interface Board {
  id: number;
  name: { [key: string]: string };
}

interface Taxonomy {
  board: Board;
  class: Class;
  l1_skill: Skill;
  l2_skill: Skill[];
  l3_skill: Skill[];
}

// Define the structure for individual questions
interface Question {
  id: number;
  identifier: string;
  sequence: number;
}

export class QuestionSet extends Model {
  declare id: number;
  declare identifier: string;
  declare title: { [key: string]: string };
  declare description?: { [key: string]: string } | null;
  declare repository?: { id: number; name: { [key: string]: string } } | null;
  declare questions: Question[]; // Updated to array of Question objects
  declare sequence: number;
  declare tenant?: { id: number; name: { [key: string]: string } } | null;
  declare taxonomy: Taxonomy; // Using the detailed Taxonomy interface
  declare sub_skills?: Array<{ id: number; name: { [key: string]: string } }> | null;
  declare purpose?: string | null;
  declare is_atomic: boolean;
  declare gradient?: string | null;
  declare group_name?: number | null;
  declare content_ids?: string[] | null;
  declare instruction_text?: string | null;
  declare status: 'draft' | 'live';
  declare is_active: boolean;
  declare created_by: string;
  declare updated_by?: string | null;
}

// Initialize the QuestionSet model
QuestionSet.init(
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
    title: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    repository: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    questions: {
      type: DataTypes.JSONB, // Store questions as a JSONB array
      allowNull: true,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tenant: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    taxonomy: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Taxonomy information including board, class, and skills',
    },
    sub_skills: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    purpose: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_atomic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    gradient: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    group_name: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content_ids: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    instruction_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'live'),
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
    modelName: 'QuestionSet',
    tableName: 'question_set',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
