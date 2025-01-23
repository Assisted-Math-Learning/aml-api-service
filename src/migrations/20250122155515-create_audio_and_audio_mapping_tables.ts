import { QueryInterface, DataTypes } from 'sequelize';

const audioTableName = 'audio_master';
const audioMappingTableName = 'audio_question_mapping';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        audioTableName,
        {
          id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
          },
          identifier: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          description_hash: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          language: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          audio_path: {
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
        },
        { transaction },
      );

      await queryInterface.createTable(
        audioMappingTableName,
        {
          id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
          },
          audio_id: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          question_id: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          language: {
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
      await queryInterface.dropTable(audioTableName, { transaction });
      await queryInterface.dropTable(audioMappingTableName, { transaction });
    });
  },
};
