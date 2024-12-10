import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';
import * as uuid from 'uuid';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    const boards: { id: number }[] = await queryInterface.sequelize.query('SELECT id FROM board_master', {
      type: QueryTypes.SELECT,
    });

    const boardsIds = boards.map((board) => board.id);

    // Create a default tenant with all board IDs
    const tenantIdentifier = uuid.v4();
    await queryInterface.sequelize.query(
      `INSERT INTO tenant 
        (
          identifier, 
          name, 
          type, 
          board_id, 
          is_active, 
          status, 
          created_by, 
          updated_by
        ) 
        VALUES 
        (
          '${tenantIdentifier}', 
          '{ "en": "Default Tenant" }', 
          '{ "en": "government" }', 
          '{${boardsIds.join(',')}}', 
          TRUE, 
          'draft', 
          'system', 
          NULL
        )`,
      {
        type: QueryTypes.INSERT,
      },
    );

    await queryInterface.addColumn('learner', 'tenant_id', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: tenantIdentifier,
    });
  },

  /**
   * Write code here for migration rollback.
   *
   * @param queryInterface
   */
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('learner', 'tenant_id');
  },
};
