import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { Question } from '../../models/question';

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Discard Question API', () => {
  const discardUrl = '/api/v1/question/discard';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and discard the question successfully', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve({ dataValues: { id: 3 } });
    });
    chai.spy.on(Question, 'destroy', () => {
      return Promise.resolve(1); // Number of rows affected
    });

    chai
      .request(app)
      .post(`${discardUrl}/3`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should return 404 if the question does not exist', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve(null);
    });

    chai
      .request(app)
      .post(`${discardUrl}/1`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('NOT_FOUND');
        done();
      });
  });
  it('should return 500 and database connection error', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${discardUrl}/1`)
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
