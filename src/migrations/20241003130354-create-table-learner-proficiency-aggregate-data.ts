import { QueryInterface, DataTypes } from 'sequelize';

const tableName = 'learner_proficiency_aggregate_data';

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
      identifier: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      learner_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      taxonomy: {
        allowNull: false,
        type: DataTypes.JSONB,
      },
      class: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      l1_skill: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      l2_skill: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      l3_skill: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      sub_skills: {
        allowNull: true,
        type: DataTypes.JSONB,
      },
      questions_count: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      score: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
      created_by: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      updated_by: {
        allowNull: true,
        type: DataTypes.STRING,
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
