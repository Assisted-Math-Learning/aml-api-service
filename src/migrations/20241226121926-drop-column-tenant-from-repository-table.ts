import { QueryInterface, DataTypes } from 'sequelize';

const tableName = 'repository';
const columnName = 'tenant';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn(tableName, columnName);
  },

  /**
   * Write code here for migration rollback.
   *
   * @param queryInterface
   */
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn(tableName, columnName, {
      type: DataTypes.JSONB,
      allowNull: true,
    });
  },
};
