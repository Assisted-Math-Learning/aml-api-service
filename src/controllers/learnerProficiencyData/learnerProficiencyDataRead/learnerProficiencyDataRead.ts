import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../../utils/responseHandler';
import { readLearnerAggregateData } from '../../../services/learnerProficiencyData';

const learnerProficiencyDataRead = async (req: Request, res: Response) => {
  const learner_id = _.get(req, 'params.learner_id');
  // const msgid = _.get(req, ['body', 'params', 'msgid']);
  // const resmsgid = _.get(res, 'resmsgid');

  // TODO: validate learner_id
  // TODO: filter by skill/grade

  const { learnerAggregateData } = await readLearnerAggregateData(learner_id);

  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: { message: 'Learner data read successfully', data: learnerAggregateData },
  });
};

export default learnerProficiencyDataRead;
