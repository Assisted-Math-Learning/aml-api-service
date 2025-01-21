import { QueryInterface, DataTypes } from 'sequelize';
import { AppDataSource } from '../config';

const tableNames = ['question', 'question_set', 'content', 'question_stage', 'question_set_stage', 'content_stage'];
const columnName = 'identifier';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    const transaction = await AppDataSource.transaction();
    try {
      for (const tableName of tableNames) {
        await queryInterface.changeColumn(
          tableName,
          columnName,
          {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          { transaction },
        );
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
    }
  },

  /**
   * Write code here for migration rollback.
   *
   * @param queryInterface
   */
  down: async (queryInterface: QueryInterface) => {
    const transaction = await AppDataSource.transaction();
    try {
      for (const tableName of tableNames) {
        await queryInterface.changeColumn(
          tableName,
          columnName,
          {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
          },
          { transaction },
        );
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
    }
  },
};
