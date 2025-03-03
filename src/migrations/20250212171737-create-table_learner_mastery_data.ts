import { QueryInterface, DataTypes } from 'sequelize';

const tableName = 'learner_mastery_data';

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
      learner_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sub_topic_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      skill_combination_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mastery_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      accuracy: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_recent_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      complexity_score_percentile: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      max_complexity_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      updated_for_question_set_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      updated_for_question_set_id: {
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
