import { QueryInterface, DataTypes } from 'sequelize';

const tableName = `tenant`;
const columnName = `enable_telemetry`;

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn(tableName, columnName, {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
