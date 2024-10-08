import app from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it } from 'mocha';
import { schemaValidation } from '../../services/validationService';
import { getEntitySearch } from '../../services/master';
import { search_master_request } from './fixture';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

describe('Bulk Search API', () => {
  const searchUrl = '/api/v1/master/search';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and search results for valid input', (done) => {
    // Mock schema validation to return a valid schema
    chai.spy.on(schemaValidation, 'default', () => ({
      isValid: true,
    }));

    // Mock the getEntitySearch service to simulate search results
    chai.spy.on(getEntitySearch, 'default', () => {
      return Promise.resolve([]);
    });

    chai
      .request(app)
      .post(searchUrl)
      .send(search_master_request.validequest)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('OK');
        res.body.result.should.be.a('array');
        done();
      });
  });

  it('should return 400 for invalid input', (done) => {
    chai.spy.on(schemaValidation, 'default', () => {
      return { isValid: false, message: 'Invalid input schema' };
    });

    chai
      .request(app)
      .post(searchUrl)
      .send(search_master_request.invalidSchemaRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('MASTER_INVALID_INPUT');
        done();
      });
  });
});
