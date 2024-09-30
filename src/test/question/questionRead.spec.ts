import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../app';
import { Question } from '../../models/question';

chai.use(chaiHttp);
chai.use(spies);

describe('Read Question API', () => {
  const getUrl = '/api/v1/question/read';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and successfully retrieve the question details', (done) => {
    // Mocking the findOne method to return a valid question
    const mockQuestionData = {
      identifier: 'a598133a-df9e-4e26-8281-86d148899c04',
      qid: 'q0004',
      question_set_id: 'set001',
      type: 'grid',
      operation: 'division',
      name: {
        en: 'This is a question for Division',
        hi: 'यह विभाजन के लिए प्रश्न है',
        ka: 'ಇದು ವಿಭಜನೆಯ ಪ್ರಶ್ನೆ',
      },
      description: {
        en: 'This is the description for the question',
      },
      tenant: {
        name: 'EkStep',
      },
      repository: {
        name: 'AML',
      },
      taxonomy: {
        l1: 'division',
        l2: '4D',
        l3: '4D by 2D without remainder',
        board: 'CBSE',
        class: 'Class-1',
      },
      gradient: 'g4',
      hints: {
        en: ['This is a hint for the question'],
      },
      status: 'draft',
      media: [
        {
          src: 'https://example.com/media/div.png',
          baseUrl: 'http://www.example.com/media',
          mimeType: 'image',
          mediaType: 'image/png',
        },
      ],
      question_body: {
        numbers: ['8012', '12'],
        prefill: ['BB', 'FBB'],
        showCarry: false,
        wrongAnswers: [
          {
            '650,0': ['carry'],
          },
          {
            '510,10': ['pvp'],
          },
          {
            option: '650,0',
            subskill: ['x+0', 'carry'],
          },
          {
            option: '510,10',
          },
        ],
        wronganswer1: [
          {
            value: 0,
            option: '650,0',
            subskill: ['carry'],
          },
          {
            value: 0,
            option: '510,10',
            subskill: ['x+0'],
          },
        ],
        division_intermediate_steps_preFill: ['BB', 'BF', 'BB', 'BB'],
      },
      created_by: null,
      updated_by: null,
      is_active: true,
      created_at: '2024-09-12T20:17:05.601Z',
      updated_at: '2024-09-12T20:17:05.602Z',
    };

    // Mocking findOne to return mockQuestionData
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve({ dataValues: { mockQuestionData } });
    });

    // Performing GET request to fetch the question
    chai
      .request(app)
      .get(`${getUrl}/2`) // Assuming 2 is the question ID
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should return 409 and Requested tenant id  does not exist', (done) => {
    chai.spy.on(Question, 'findAll', () => {
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
        res.body.responseCode.should.be.eq('NOT_FOUND');
        done();
      });
  });

  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(Question, 'findOne', () => {
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
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        done();
      });
  });
});
