import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { SubSkillMaster } from '../../models/subSkillMaster'; // Adjust import as needed
import { subskill_update_request } from './fixture'; // Ensure this file provides the correct fixtures

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('SUBSKILL UPDATE API', () => {
  const updateUrl = '/api/v1/sub-skill/update'; // Updated URL for subskill

  afterEach(() => {
    chai.spy.restore();
  });

  // Test case: Successful subskill update
  it('should return 200 and update the subskill successfully', (done) => {
    chai.spy.on(SubSkillMaster, 'findOne', () => {
      return Promise.resolve({ dataValues: { status: 'live' } });
    });
    chai.spy.on(SubSkillMaster, 'update', () => {
      return Promise.resolve([1, [{ id: 1, status: 'live' }]]); // Simulate successful update
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(subskill_update_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  // Test case: Invalid request body
  it('should return 400 if the request body is invalid for subskill update', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(subskill_update_request.invalidRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('SUBSKILL_INVALID_INPUT'); // Updated error code
        done();
      });
  });

  // Test case: Not Found error
  it('should return 404 if the subskill does not exist', (done) => {
    chai.spy.on(SubSkillMaster, 'findOne', () => {
      return Promise.resolve(null); // Simulate not found
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(subskill_update_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('SUBSKILL_NOT_EXISTS'); // Updated error code
        done();
      });
  });

  // Test case: Database connection error
  it('should return 500 and database connection error during update', (done) => {
    chai.spy.on(SubSkillMaster, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(subskill_update_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        done();
      });
  });
});
