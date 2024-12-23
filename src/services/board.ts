import { Op } from 'sequelize';
import { Status } from '../enums/status';
import { boardMaster } from '../models/boardMaster';
import _ from 'lodash';
import { DEFAULT_LIMIT } from '../constants/constants';
import { Sequelize } from 'sequelize-typescript';

//get board by ids
export const getBoards = async (board_ids: number[]): Promise<any> => {
  const whereClause: Record<string, any> = { id: board_ids, is_active: true, status: Status.LIVE };
  const boards = await boardMaster.findAll({ where: whereClause, raw: true });
  return boards;
};

//board name exists
export const checkBoardNameExists = async (boardName: string): Promise<boolean> => {
  const board = await boardMaster.findOne({
    where: {
      name: {
        [Op.contains]: { en: boardName },
      },
      status: Status.LIVE,
      is_active: true,
    },
  });
  return !!board;
};

//get board by id
export const getBoard = async (board_identifier: string): Promise<any> => {
  const board = await boardMaster.findOne({
    where: { identifier: board_identifier, status: Status.LIVE, is_active: true },
    raw: true,
  });
  return board;
};

//update the board
export const updateBoardData = async (board_identifier: string, data: any): Promise<any> => {
  const existingBoard = await getBoard(board_identifier);

  if (!existingBoard) {
    throw new Error('Board not found'); // Handle board not found scenario
  }

  const updatedData = {
    ...existingBoard,
    ...data,
  };

  await boardMaster.update(updatedData, {
    where: { identifier: board_identifier },
  });

  return updatedData;
};

export const checkBoardNamesExists = async (boardNames: { [key: string]: string }): Promise<{ exists: boolean; board?: any }> => {
  // Map over boardNames to create dynamic conditions
  const conditions = Object.entries(boardNames).map(([lang, name]) => ({
    name: { [Op.contains]: { [lang]: name } },
    is_active: true,
    status: Status.LIVE,
  }));

  // Query the boardMaster model
  const board = await boardMaster.findOne({
    where: { [Op.or]: conditions },
    attributes: ['id', 'name'],
  });

  // Return result with simpler logic
  return board ? { exists: true, board: board.toJSON() } : { exists: false };
};

//list board
export const getBoardList = async (req: Record<string, any>) => {
  const limit: any = _.get(req, 'limit');
  const offset: any = _.get(req, 'offset');
  const searchQuery: any = _.get(req, 'search_query');

  let whereClause: any = {
    status: Status.LIVE,
  };

  if (searchQuery) {
    whereClause = {
      ...whereClause,
      [Op.or]: [
        Sequelize.literal(`
    EXISTS (
      SELECT 1 
      FROM jsonb_each_text(name) AS kv
      WHERE LOWER(kv.value) LIKE '%${searchQuery.toLowerCase()}%'
    )
  `),
        Sequelize.literal(`
    EXISTS (
      SELECT 1 
      FROM jsonb_each_text(description) AS kv
      WHERE LOWER(kv.value) LIKE '%${searchQuery.toLowerCase()}%'
    )
  `),
      ],
    };
  }

  const finalLimit = limit || DEFAULT_LIMIT;
  const finalOffset = offset || 0;

  const { rows, count } = await boardMaster.findAndCountAll({ where: whereClause, limit: finalLimit, offset: finalOffset });

  return {
    boards: rows,
    meta: {
      offset: finalOffset,
      limit: finalLimit,
      total: count,
    },
  };
};
