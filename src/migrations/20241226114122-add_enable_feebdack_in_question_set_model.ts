import { QueryInterface, DataTypes } from 'sequelize';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('question_set', 'enable_feedback', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.sequelize.query(`UPDATE question_set SET enable_feedback = FALSE WHERE question_set.purpose = 'Main Diagnostic'`);
  },

  /**
   * Write code here for migration rollback.
   *
   * @param queryInterface
   */
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('question_set', 'enable_feedback');
  },
};
