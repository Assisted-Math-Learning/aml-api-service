import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import updateBoard from '../../controllers/boardUpdate/boardUpdate';
import boardReadById from '../../controllers/boardRead/boardRead';

const boardRouter = express.Router();

boardRouter.get('/read/:board_id', setDataToRequestObject('api.board.read'), boardReadById);

boardRouter.post('/update/:board_id', setDataToRequestObject('api.board.update'), updateBoard);

export default boardRouter;
