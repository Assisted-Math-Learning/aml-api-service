import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import createQuestion from '../../controllers/questionCreate/questionCreate';
import publishQuestion from '../../controllers/questionPublish/publishQuestion';
import readQuestionById from '../../controllers/questionRead/questionRead';
import updateQuestionById from '../../controllers/questionUpdate/questionUpdate';
import deleteQuestionById from '../../controllers/questionDelete/deleteQuestion';
import discardQuestionById from '../../controllers/questionDiscard/discardQuestion';
import { searchQuestions } from '../../controllers/questionSearch/searchQuestion';

const questionRouter = express.Router();

questionRouter.post('/create', setDataToRequestObject('api.question.create'), createQuestion);

questionRouter.post('/publish/:question_id', setDataToRequestObject('api.question.publish'), publishQuestion);

questionRouter.get('/read/:question_id', setDataToRequestObject('api.question.read'), readQuestionById);

questionRouter.post('/update/:question_id', setDataToRequestObject('api.question.update'), updateQuestionById);

questionRouter.post('/delete/:question_id', setDataToRequestObject('api.question.delete'), deleteQuestionById);

questionRouter.post('/discard/:question_id', setDataToRequestObject('api.question.discard'), discardQuestionById);

questionRouter.post('/search', setDataToRequestObject('api.question.search'), searchQuestions);

export default questionRouter;
