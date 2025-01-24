import { QueryInterface, DataTypes } from 'sequelize';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('audio_stage', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      identifier: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      process_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      audio_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('progress', 'errored', 'success'),
        allowNull: true,
      },
      error_info: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('audio_stage');
  },
};
