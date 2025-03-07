import { QueryInterface, DataTypes } from 'sequelize';

const tableName = 'question_meta';

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
      question_group_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      complexity_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      sub_skill_value_ids: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      meta: {
        type: DataTypes.JSONB,
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
