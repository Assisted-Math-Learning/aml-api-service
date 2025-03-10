import { QueryInterface, DataTypes } from 'sequelize';

const tableName = 'sub_topic_nql_type_mapping';

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
      identifier: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sub_topic_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nql_type: {
        type: DataTypes.STRING,
        allowNull: false,
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
