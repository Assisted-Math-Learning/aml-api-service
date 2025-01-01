import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { BoardMaster } from '../../models/boardMaster'; // Adjust this import as needed
import { board_update_request } from './fixture'; // Ensure this file provides the correct fixtures
import { SkillTaxonomy } from '../../models/skillTaxonomy';
import { classMaster } from '../../models/classMaster';
import { SkillMaster } from '../../models/skill';

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('BOARD UPDATE API', () => {
  const updateUrl = '/api/v1/board/update'; // Updated URL for board

  afterEach(() => {
    chai.spy.restore();
  });

  // Test case: Successful board update
  it('should return 200 and update the board successfully', (done) => {
    chai.spy.on(BoardMaster, 'findOne', () => {
      return Promise.resolve({ dataValues: { status: 'live' } });
    });

    chai.spy.on(SkillTaxonomy, 'findAll', () => {
      return Promise.resolve([
        { id: 1, status: 'live' },
        { id: 2, status: 'live' },
      ]);
    });

    chai.spy.on(classMaster, 'findAll', () => {
      return Promise.resolve([
        { id: 3, status: 'live' },
        { id: 4, status: 'live' },
      ]);
    });

    chai.spy.on(SkillMaster, 'findAll', () => {
      return Promise.resolve([
        { id: 1, status: 'live' },
        { id: 2, status: 'live' },
      ]);
    });

    chai.spy.on(BoardMaster, 'update', () => {
      return Promise.resolve([1, [{ id: 1, status: 'live' }]]); // Simulate successful update
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(board_update_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  // Test case: Database connection error
  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(BoardMaster, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(board_update_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        done();
      });
  });

  // Test case: Not Found error
  it('should return 404 if the board does not exist', (done) => {
    chai.spy.on(BoardMaster, 'findOne', () => {
      return Promise.resolve(null); // Simulate not found
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(board_update_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('BOARD_NOT_EXISTS'); // Updated error code
        done();
      });
  });

  // Test case: Invalid request body
  it('should return 400 if the request body is invalid for board update', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(board_update_request.invalidRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('BOARD_INVALID_INPUT'); // Updated error code
        done();
      });
  });
});
