import { QueryInterface, DataTypes } from 'sequelize';

const tableName = 'sub_topic_hierarchy';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sub_topic_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      class_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_types: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      include_in_diagnostic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      board_id: {
        type: DataTypes.STRING,
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
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
