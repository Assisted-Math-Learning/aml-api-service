import app from '../../app';
import { Question } from '../../models/question';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it } from 'mocha';
import { insert_question_request } from './fixture';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

describe('Question CREATE API', () => {
  const insertUrl = '/api/v1/question/create';

  // Restore spies after each test
  afterEach(() => {
    chai.spy.restore();
  });

  // Test case: Successful Question creation
  it('Should insert Question into the database', (done) => {
    // Mocking Question.create to simulate Question creation
    chai.spy.on(Question, 'create', () => {
      return Promise.resolve({ dataValues: { identifier: 1, name: { en: 'This is a question for Division' } } });
    });

    // Sending request to the API
    chai
      .request(app)
      .post(insertUrl)
      .send(insert_question_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  // Test case: Database connection failure
  it('Should not insert record into the database when transaction fails', (done) => {
    // Mocking transaction to simulate a failure
    chai.spy.on(Question, 'create', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(insertUrl)
      .send(insert_question_request.validRequest)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('INTERNAL_SERVER_ERROR');
        done();
      });
  });

  // Test case: Request object contains missing fields
  it('Should not insert record when request object contains missing fields', (done) => {
    // Sending request with missing required fields
    chai
      .request(app)
      .post(insertUrl)
      .send(insert_question_request.invalidRequest)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('QUESTION_INVALID_INPUT');
        done();
      });
  });

  // Test case: Invalid schema in request
  it('Should not insert record when given invalid schema', (done) => {
    // Sending request with an invalid schema
    chai
      .request(app)
      .post(insertUrl)
      .send(insert_question_request.invalidRequest)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('QUESTION_INVALID_INPUT');
        done();
      });
  });
});
