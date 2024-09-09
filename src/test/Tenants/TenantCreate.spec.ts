import app from '../../app';
import { Tenant } from '../../models/tenant';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it } from 'mocha';
import { AppDataSource } from '../../config';
import { tenant_request } from './fixture';
import { boardMaster } from '../../models/boardMaster';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

describe('TENANT CREATE API', () => {
  const insertUrl = '/api/v1/tenant/create';

  // Restore spies after each test
  afterEach(() => {
    chai.spy.restore();
  });

  // Test case: Successful tenant creation
  it('Should insert tenant and tenant board into the database', (done) => {
    // Mocking Tenant.findOne to simulate no tenant found
    chai.spy.on(Tenant, 'findOne', () => {
      return Promise.resolve(null);
    });

    // Mocking AppDataSource.query to return a simulated next value
    chai.spy.on(AppDataSource, 'query', () => {
      return Promise.resolve([{ nextVal: 9 }]);
    });

    chai.spy.on(boardMaster, 'findAll', () => {
      return Promise.resolve([{ id: 1, name: 'Board 1', is_active: true }]);
    });

    // Mocking Tenant.create to simulate tenant creation
    chai.spy.on(Tenant, 'create', () => {
      return Promise.resolve({ dataValues: { id: 1, name: 'tenant' } });
    });

    // Mocking transaction methods
    const transactionMock = {
      commit: chai.spy(() => Promise.resolve({})),
      rollback: chai.spy(() => Promise.resolve({})),
    };

    // Mocking AppDataSource.transaction to return our transaction mock
    chai.spy.on(AppDataSource, 'transaction', () => {
      return Promise.resolve(transactionMock);
    });

    // Sending request to the API
    chai
      .request(app)
      .post(insertUrl)
      .send(tenant_request.tenantCreate)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  // Test case: Database connection failure
  it('Should not insert record into the database when transaction fails', (done) => {
    // Mocking transaction to simulate a failure
    chai.spy.on(AppDataSource, 'transaction', () => {
      return Promise.reject(new Error('error occurred while connecting to the database'));
    });

    // Sending request to the API
    chai
      .request(app)
      .post(insertUrl)
      .send(tenant_request.tenantCreate)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        done();
      });
  });

  // Test case: Request object contains missing fields
  it('Should not insert record when request object contains missing fields', (done) => {
    // Sending request with missing required fields
    chai
      .request(app)
      .post(insertUrl)
      .send(tenant_request.invalidTenantRequest)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('TENANT_INVALID_INPUT');
        done();
      });
  });

  // Test case: Invalid schema in request
  it('Should not insert record when given invalid schema', (done) => {
    // Sending request with an invalid schema
    chai
      .request(app)
      .post(insertUrl)
      .send(tenant_request.invalidTenantSchema)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('TENANT_INVALID_INPUT');
        done();
      });
  });
});
