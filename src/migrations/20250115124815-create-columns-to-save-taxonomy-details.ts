import { QueryInterface, DataTypes } from 'sequelize';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'learner',
        'board_id',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'learner',
        'school_id',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'learner',
        'class_id',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'learner',
        'section_id',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'learner',
        'name',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
    });
  },

  /**
   * Write code here for migration rollback.
   *
   * @param queryInterface
   */
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('learner', 'board_id', { transaction });
      await queryInterface.removeColumn('learner', 'school_id', { transaction });
      await queryInterface.removeColumn('learner', 'class_id', { transaction });
      await queryInterface.removeColumn('learner', 'section_id', { transaction });
      await queryInterface.removeColumn('learner', 'name', { transaction });
    });
  },
};
