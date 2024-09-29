import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../app';
import { Tenant } from '../../models/tenant';

chai.use(chaiHttp);
chai.use(spies);

describe('Tenant read API', () => {
  const getUrl = '/api/v1/tenant/read';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and get all the tenant details along board and class', (done) => {
    const tenantReadMockData = {
      dataValues: {
        id: 3,
        tenant_name: 'karnataka',
        tenant_type: 'government',
        board_id: [1, 2],
        is_active: true,
        status: 'draft',
        created_by: 1,
        updated_by: null,
        created_at: '2024-08-23T04:11:30.062Z',
        updated_at: '2024-08-23T04:11:30.062Z',
      },
    };

    chai.spy.on(Tenant, 'findAll', () => {
      return Promise.resolve(tenantReadMockData);
    });

    chai
      .request(app)
      .get(`${getUrl}/3`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should return 404 and Requested tenant id  does not exist', (done) => {
    chai.spy.on(Tenant, 'findOne', () => {
      return Promise.resolve(null);
    });

    chai
      .request(app)
      .get(`${getUrl}/3`)
      .end((err, res) => {
        if (err) return done(err);
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
      .get(`${getUrl}/1`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('INTERNAL_SERVER_ERROR');
        done();
      });
  });
});
