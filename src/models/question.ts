import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';
import { QuestionType } from '../enums/questionType';
import { Taxonomy } from '../types/taxonomy';
import { QuestionOperation } from '../enums/questionOperation';

// Define interfaces for the structures used in the Question model
interface Repository {
  identifier: number;
  name: { [key: string]: string };
}

interface QuestionBody {
  numbers: { n1: number | null; n2: number | null }; // Correct union type syntax
  options: { [key: string]: any }; // Use 'any' if options can have varied structures
  correct_option: string; // This holds the correct answer option
  answers: { [key: string]: any }; // Dynamic structure for the answer
  wrong_answer: { value: number[]; subskillname: string }[]; // Array of objects with 'value' and 'subskillname'
  question_image: { src: string; fileName: string; mimeType: string; mediaType: string };
}

export class Question extends Model {
  declare id: number;
  declare identifier: string;
  declare benchmark_time: number;
  declare question_type: QuestionType;
  declare operation: QuestionOperation;
  declare name: { [key: string]: string };
  declare description?: { [key: string]: string } | null;
  declare tenant?: { id: number; name: { [key: string]: string } } | null;
  declare repository: Repository; // Using the Repository interface
  declare taxonomy: Taxonomy; // Using the Taxonomy interface
  declare gradient?: string | null;
  declare hints?: { [key: string]: string } | null;
  declare status: 'draft' | 'live';
  declare media?: Array<{ src: string; fileName: string; mimeType: string; mediaType: string }> | null;
  declare question_body: QuestionBody;
  declare sub_skills?: Array<{ identifier: string; name: { [key: string]: string } }> | null;
  declare question_audio_description?: Record<string, string> | null;
  declare created_by: string;
  declare updated_by?: string;
  declare is_active: boolean;
  declare x_id: string;
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
    question_audio_description: {
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
    x_id: {
      type: DataTypes.STRING,
      allowNull: true,
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
