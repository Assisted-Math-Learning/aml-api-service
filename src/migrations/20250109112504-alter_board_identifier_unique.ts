import { QueryInterface } from 'sequelize';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addConstraint('board_master', {
      fields: ['identifier'],
      type: 'unique',
      name: 'unique_identifier',
    });
  },

  /**
   * Write code here for migration rollback.
   *
   * @param queryInterface
   */
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeConstraint('board_master', 'unique_identifier');
  },
};
