import app from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it } from 'mocha';
import { schemaValidation } from '../../services/validationService';
import { search_skillTaxonomy_request } from './fixture';
import { SkillTaxonomy } from '../../models/skillTaxonomy';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

describe('Bulk Search API', () => {
  const searchUrl = '/api/v1/skill-taxonomy/search';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and search results for valid input', (done) => {
    // Mock schema validation to return a valid schema
    chai.spy.on(schemaValidation, 'default', () => ({
      isValid: true,
    }));

    // Mock the getEntitySearch service to simulate search results
    chai.spy.on(SkillTaxonomy, 'findAll', () => {
      return Promise.resolve([
        {
          id: 1,
          name: 'Skill 1',
          description: 'Description for Skill 1',
          status: 'live',
          is_active: true,
        },
        {
          id: 2,
          name: 'Skill 2',
          description: 'Description for Skill 1',
          status: 'live',
          is_active: true,
        },
      ]);
    });

    chai
      .request(app)
      .post(searchUrl)
      .send(search_skillTaxonomy_request.validRequest)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('OK');
        res.body.result.should.be.a('array');
        res.body.result.length.should.be.eq(2);

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
      .send(search_skillTaxonomy_request.invalidRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('SKILL_TAXONOMY_INVALID_INPUT');
        done();
      });
  });
});
