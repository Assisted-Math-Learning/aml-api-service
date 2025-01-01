import app from '../../app';
import { BoardMaster } from '../../models/boardMaster';
import { classMaster } from '../../models/classMaster';
import { SubSkillMaster } from '../../models/subSkillMaster';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it } from 'mocha';
import { insert_master_request } from './fixture';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

describe('Master Insert API', () => {
  const masterInsertUrl = '/api/v1/master/create';

  // Restore spies after each test
  afterEach(() => {
    chai.spy.restore();
  });

  it('Should bulk insert entities into the database', (done) => {
    // Mocking findOne to simulate no entities found
    chai.spy.on(BoardMaster, 'findOne', () => Promise.resolve(null));
    chai.spy.on(classMaster, 'findOne', () => Promise.resolve(null));
    chai.spy.on(SubSkillMaster, 'findOne', () => Promise.resolve(null));

    // Mocking create to simulate entity creation
    chai.spy.on(BoardMaster, 'create', () => Promise.resolve({ id: 1, name: 'Board1' }));
    chai.spy.on(classMaster, 'create', () => Promise.resolve({ id: 1, name: 'Class1' }));
    chai.spy.on(SubSkillMaster, 'create', () => Promise.resolve({ id: 1, name: 'SubSkill1' }));

    // Sending request to the API
    chai
      .request(app)
      .post(masterInsertUrl)
      .send(insert_master_request.validRequest) // Assuming valid data is provided here
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('Should return an error when request object contains invalid data', (done) => {
    // Sending request with invalid fields
    chai
      .request(app)
      .post(masterInsertUrl)
      .send(insert_master_request.invalidSchema)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('MASTER_INVALID_INPUT');
        done();
      });
  });

  // Test case: Insert fails due to database connection issues
  it('Should return an error when database connection fails', (done) => {
    // Mocking create to simulate a failure
    chai.spy.on(BoardMaster, 'findOne', () => Promise.resolve(null));
    chai.spy.on(classMaster, 'findOne', () => Promise.resolve(null));
    chai.spy.on(SubSkillMaster, 'findOne', () => Promise.resolve(null));

    // Mocking create to simulate an error during creation
    chai.spy.on(BoardMaster, 'create', () => Promise.reject(new Error('Database error')));
    chai.spy.on(classMaster, 'create', () => Promise.reject(new Error('Database error')));
    chai.spy.on(SubSkillMaster, 'create', () => Promise.reject(new Error('Database error')));

    chai
      .request(app)
      .post(masterInsertUrl)
      .send(insert_master_request.validRequest)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        done();
      });
  });
});
