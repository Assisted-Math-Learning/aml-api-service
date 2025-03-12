import { QueryInterface, DataTypes } from 'sequelize';

const tableName = 'class_master';
const columnName = 'sequence';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn(tableName, columnName, {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  /**
   * Write code here for migration rollback.
   *
   * @param queryInterface
   */
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn(tableName, columnName);
  },
};
