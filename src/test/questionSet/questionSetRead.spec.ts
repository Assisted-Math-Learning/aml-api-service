import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { QuestionSet } from '../../models/questionSet'; // Corrected model import

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Read Question Set API', () => {
  const getUrl = '/api/v1/question-set/read'; // Updated endpoint

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and successfully retrieve the question set details', (done) => {
    // Mocking the findOne method to return a valid question set
    const mockQuestionSetData = {
      identifier: 'ea467d5b-2256-4036-8a36-346fd6192353',
      title: { en: 'Question Set 2' },
      description: { en: 'This is a question description1' },
      repository: { id: 2, name: { en: 'Question Repository' } },
      questions: [
        {
          id: 1,
          sequence: 3,
          identifier: 'a6d437ce-85b3-4880-9481-4f5e588c0d56',
        },
        {
          id: 2,
          sequence: 2,
          identifier: '8603bdec-1df7-4911-b5e1-28a333e59027',
        },
        {
          id: 3,
          sequence: 1,
          identifier: '2e90f1d6-ea0b-4f9d-aaba-dc16b56e9ad3',
        },
      ],
      sequence: 1,
      tenant: { id: 2, name: { en: 'Karnataka', hi: 'कर्नाटका' } },
      taxonomy: {
        board: { id: 11, name: [Object] },
        class: { id: 13, name: [Object] },
        l1_skill: { id: 1, name: [Object] },
        l2_skill: [[Object]],
        l3_skill: [[Object]],
      },
      sub_skills: [{ id: 4, name: [Object] }],
      purpose: 'Practice',
      is_atomic: false,
      gradient: 'g2',
      group_name: 1,
      content_ids: ['b68dc3a5-f37f-4d69-b4f3-555408c2fab8'],
      instruction_text: 'text',
      status: 'draft',
      is_active: true,
      created_by: 'manual',
      updated_by: null,
    };

    // Mocking findOne to return mockQuestionSetData
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.resolve({ dataValues: mockQuestionSetData }); // Return mock data
    });

    // Performing GET request to fetch the question set
    chai
      .request(app)
      .get(`${getUrl}/1`) // Assuming 1 is the question set ID
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should return 404 if the question set does not exist', (done) => {
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.resolve(null); // No question set found
    });

    chai
      .request(app)
      .get(`${getUrl}/999`) // Attempting to read a non-existing question set
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('NOT_FOUND');
        done();
      });
  });

  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error')); // Simulate a database error
    });

    chai
      .request(app)
      .get(`${getUrl}/1`) // Attempting to read question set
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
