import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import publishQuestionSet from '../../controllers/questionSetPublish/questionSetPublish';
import readQuestionSetById from '../../controllers/questionSetRead/questionSetRead';
import updateQuestionSetById from '../../controllers/questionSetUpdate/questionSetUpdate';
import deleteQuestionSetById from '../../controllers/questionSetDelete/questionSetDelete';
import discardQuestionSetById from '../../controllers/questionSetDiscard/questionSetDiscard';
import { searchQuestionSets } from '../../controllers/questionSetSearch/questionSetSearch';
import createQuestionSet from '../../controllers/questionSetCreate/questionSetCreate';

const questionSetRouter = express.Router();

questionSetRouter.post('/create', setDataToRequestObject('api.questionSet.create'), createQuestionSet);

questionSetRouter.post('/publish/:question_set_id', setDataToRequestObject('api.questionSet.publish'), publishQuestionSet);

questionSetRouter.get('/read/:question_set__id', setDataToRequestObject('api.questionSet.read'), readQuestionSetById);

questionSetRouter.post('/update/:question_set__id', setDataToRequestObject('api.questionSet.update'), updateQuestionSetById);

questionSetRouter.post('/delete/:question_set_id', setDataToRequestObject('api.questionSet.delete'), deleteQuestionSetById);

questionSetRouter.post('/discard/:question_set__id', setDataToRequestObject('api.questionSet.discard'), discardQuestionSetById);

questionSetRouter.post('/search', setDataToRequestObject('api.questionSet.search'), searchQuestionSets);

export default questionSetRouter;
