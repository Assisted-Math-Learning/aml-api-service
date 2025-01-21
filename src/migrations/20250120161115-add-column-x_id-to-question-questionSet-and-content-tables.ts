import { QueryInterface, DataTypes } from 'sequelize';
import { AppDataSource } from '../config';

const tableNames = ['question', 'question_set', 'content'];
const columnName = 'x_id';

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
        await queryInterface.addColumn(
          tableName,
          columnName,
          {
            type: DataTypes.STRING,
            allowNull: true,
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
