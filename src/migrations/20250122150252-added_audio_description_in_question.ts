import { QueryInterface, DataTypes } from 'sequelize';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('question', 'question_audio_description', {
      type: DataTypes.JSONB,
      allowNull: true,
    });
  },

  /**
   * Write code here for migration rollback.
   *
   * @param queryInterface
   */
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('question', 'question_audio_description');
  },
};
