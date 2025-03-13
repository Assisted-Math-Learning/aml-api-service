import { Op } from 'sequelize';
import { Status } from '../enums/status';
import { BoardMaster } from '../models/boardMaster';
import _ from 'lodash';
import { DEFAULT_LIMIT } from '../constants/constants';
import { Sequelize } from 'sequelize-typescript';
import { redisService } from './integrations/redisService';

class BoardService {
  private readonly REDIS_CONSTANTS = {
    BOARD_ENT_KEY: 'board_ent',
    BOARD_LIST_MAP_PREFIX: 'board_list_map_',
  };

  private _getBoardEntKey(identifier: string) {
    return `${this.REDIS_CONSTANTS.BOARD_ENT_KEY}:${identifier}`;
  }

  private _getBoardListMapKey(filterHash: string) {
    return `${this.REDIS_CONSTANTS.BOARD_LIST_MAP_PREFIX}${filterHash}`;
  }

  static getInstance() {
    return new BoardService();
  }

  async getBoards(board_ids: number[]) {
    const whereClause: Record<string, any> = { id: board_ids, is_active: true, status: Status.LIVE };
    return BoardMaster.findAll({ where: whereClause, raw: true });
  }

  async getBoardByIdentifier(identifier: string) {
    let boardEntity = await redisService.getObject<BoardMaster>(this._getBoardEntKey(identifier));
    if (boardEntity) {
      return boardEntity;
    }
    boardEntity = await BoardMaster.findOne({
      where: { identifier: identifier, status: Status.LIVE, is_active: true },
      raw: true,
    });

    await redisService.setEntity(this._getBoardEntKey(identifier), boardEntity);
    return boardEntity;
  }

  async getBoardsByIdentifiers(identifiers: string[]) {
    return BoardMaster.findAll({
      where: { identifier: identifiers, status: Status.LIVE, is_active: true },
      raw: true,
    });
  }

  async updateBoardData(identifier: string, data: any) {
    return BoardMaster.update(data, {
      where: { identifier },
      returning: true,
    });
  }

  async checkBoardNamesExists(boardNames: { [key: string]: string }) {
    const conditions = Object.entries(boardNames).map(([lang, name]) => ({
      name: { [Op.contains]: { [lang]: name } },
      is_active: true,
      status: Status.LIVE,
    }));

    // Query the boardMaster model
    const board = await BoardMaster.findOne({
      where: { [Op.or]: conditions },
      attributes: ['id', 'name'],
    });

    // Return result with simpler logic
    return board ? { exists: true, board: board.toJSON() } : { exists: false };
  }

  async getBoardList(req: Record<string, any>) {
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

    const { rows, count } = await BoardMaster.findAndCountAll({ where: whereClause, limit: finalLimit, offset: finalOffset });

    return {
      boards: rows,
      meta: {
        offset: finalOffset,
        limit: finalLimit,
        total: count,
      },
    };
  }
}

export const boardService = BoardService.getInstance();
