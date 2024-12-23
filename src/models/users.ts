import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';
import { UserRole } from '../enums/userRole';

export class User extends Model {
  declare id: number;
  declare identifier: string;
  declare tenant_id?: string;
  declare role: UserRole;
  declare first_name: string;
  declare last_name: string;
  declare email: string;
  declare password: string;
  declare is_active: boolean;
  declare created_by: string;
  declare updated_by?: string | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tenant_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
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
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
