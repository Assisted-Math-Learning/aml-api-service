import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { Tenant } from '../../models/tenant';
import { updateTenatTenantBoard } from './fixture';
import { boardMaster } from '../../models/boardMaster';

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Tenant update API', () => {
  const updateUrl = '/api/v1/tenant/update';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and update the tenant successfully', (done) => {
    chai.spy.on(Tenant, 'findOne', () => {
      return Promise.resolve({ dataValues: { id: 1, is_active: true } });
    });

    chai.spy.on(boardMaster, 'findAll', () => {
      return Promise.resolve({ dataValues: [{ id: 1, name: 'Board 1', is_active: true }] });
    });

    chai.spy.on(Tenant, 'update', () => {
      return Promise.resolve({ name: 'Mumbai' });
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateTenatTenantBoard.validTenantUpdateRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should return 400 if the request body is invalid for tenant update', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateTenatTenantBoard.invalidTenantUpdateRequest)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('TENANT_INVALID_INPUT');
        done();
      });
  });

  it('should return 404 if the tenant does not exist', (done) => {
    chai.spy.on(Tenant, 'findOne', () => {
      return Promise.resolve(null);
    });
    chai
      .request(app)
      .post(`${updateUrl}/10`)
      .send(updateTenatTenantBoard.validTenantUpdateRequest)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('TENANT_NOT_EXISTS');
        done();
      });
  });

  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(Tenant, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateTenatTenantBoard.validTenantUpdateRequest)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('INTERNAL_SERVER_ERROR');
        done();
      });
  });
});
