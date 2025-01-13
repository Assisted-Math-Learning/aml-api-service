import { QueryInterface, DataTypes } from 'sequelize';

const tableName = 'telemetry_data';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      learner_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  /**
   * Write code here for migration rollback.
   *
   * @param queryInterface
   */
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(tableName);
  },
};
