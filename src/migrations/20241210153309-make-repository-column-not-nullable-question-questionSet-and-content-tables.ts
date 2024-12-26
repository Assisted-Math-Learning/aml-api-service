import { QueryInterface, DataTypes } from 'sequelize';
import { AppDataSource } from '../config';

const tableNames = ['question', 'question_set', 'content'];
const columnName = 'repository';

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
            type: DataTypes.JSONB,
            allowNull: false,
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
        await queryInterface.removeColumn(tableName, columnName, { transaction });
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
    }
  },
};
