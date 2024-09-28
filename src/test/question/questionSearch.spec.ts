import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../app';
import { schemaValidation } from '../../services/validationService';
import { Question } from '../../models/question';
import { search_question_request } from './fixture';

chai.use(chaiHttp);
chai.use(spies);

describe('Question Search API', () => {
  const searchUrl = '/api/v1/question/search';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and the list of question for a valid request', (done) => {
    const mockQuestionData = [
      {
        dataValues: {
          name: { en: 'Kerala', ta: 'கேரளா' },
          type: { en: 'education', ta: 'கல்வி' },
          is_active: true,
          status: 'live',
          created_by: 'system',
          created_at: '2024-09-04T11:02:26.821Z',
        },
      },
    ];

    // Mock the schema validation to return valid
    chai.spy.on(schemaValidation, 'default', () => {
      return { isValid: true };
    });

    // Mock the question service
    chai.spy.on(Question, 'findAll', () => {
      return Promise.resolve(mockQuestionData);
    });

    chai
      .request(app)
      .post(searchUrl)
      .send(search_question_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        res.body.responseCode.should.be.eq('OK');
        done();
      });
  });

  it('should return 400 if the request body is invalid filtre value for Question search', (done) => {
    chai
      .request(app)
      .post(searchUrl)
      .send(search_question_request.invalidRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('BAD_REQUEST');
        done();
      });
  });
});
