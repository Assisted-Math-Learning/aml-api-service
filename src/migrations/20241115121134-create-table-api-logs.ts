import { QueryInterface, DataTypes } from 'sequelize';

const tableName = 'api_logs';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      request_type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      learner_id: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      request_body: {
        allowNull: true,
        type: DataTypes.JSONB,
      },
      error_body: {
        allowNull: true,
        type: DataTypes.JSONB,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
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
