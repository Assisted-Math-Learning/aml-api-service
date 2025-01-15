import { QueryInterface, DataTypes } from 'sequelize';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('learner', 'school_id', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('learner', 'class_id', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('learner', 'section_id', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('learner', 'board_id', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('learner', 'name', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  /**
   * Write code here for migration rollback.
   *
   * @param queryInterface
   */
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('learner', 'school_id');
    await queryInterface.removeColumn('learner', 'class_id');
    await queryInterface.removeColumn('learner', 'section_id');
    await queryInterface.removeColumn('learner', 'board_id');
    await queryInterface.removeColumn('learner', 'name');
  },
};
