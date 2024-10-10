import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

// Define interfaces for the structures used in the Question model
interface Repository {
  id: number;
  name: { [key: string]: string };
}

interface Taxonomy {
  // Define the structure of your taxonomy here, for example:
  board: { id: number; name: { [key: string]: string } };
  class: { id: number; name: { [key: string]: string } };
  l1_skill: { id: number; name: { [key: string]: string } };
  l2_skill: { id: number; name: { [key: string]: string } }[];
  l3_skill: { id: number; name: { [key: string]: string } }[];
}

interface QuestionBody {
  options: { [key: string]: any }; // Use 'any' if options can have varied structures
  correct_option: string; // This holds the correct answer option
  answer: { [key: string]: any }; // Dynamic structure for the answer
  wrongAnswers: string[]; // Array of wrong answer strings
}

export class Question extends Model {
  declare id: number;
  declare identifier: string;
  declare benchmark_time: number;
  declare question_type: string;
  declare operation: string;
  declare name: { [key: string]: string };
  declare description?: { [key: string]: string } | null;
  declare tenant?: { id: number; name: { [key: string]: string } } | null;
  declare repository: Repository; // Using the Repository interface
  declare taxonomy: Taxonomy; // Using the Taxonomy interface
  declare gradient?: string | null;
  declare hints?: { [key: string]: string } | null;
  declare status: 'draft' | 'live';
  declare media?: Array<{ src: string; fileName: string; mimeType: string; mediaType: string }> | null;
  declare question_body: QuestionBody | null;
  declare sub_skills?: Array<{ id: number; name: { [key: string]: string } }> | null;
  declare created_by: string;
  declare updated_by?: string | null;
  declare is_active: boolean;
}

// Initialize the Question model
Question.init(
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
    benchmark_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    operation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    tenant: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    repository: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    taxonomy: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    gradient: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hints: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'live'),
      allowNull: false,
    },
    media: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    question_body: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    sub_skills: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: AppDataSource,
    modelName: 'Question',
    tableName: 'question',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
