export const insert_question_request = {
  validRequest: {
    id: 'api.question.create',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: 'aa083e25-09a6-4e52-95d5-1e780906d886',
    },
    request: {
      question_id: 1,
      question_set_id: 'set001',
      question_type: 'mcq',
      operation: 'add',
      name: {
        en: 'This is a question for Division',
        ka: 'ಇದು ವಿಭಜನೆಯ ಪ್ರಶ್ನೆ',
        hi: 'यह विभाजन के लिए प्रश्न है',
      },
      description: {
        en: 'This is the description for the question',
      },
      sequence_no: 1,
      hints: {
        en: ['This is a hint for the question'],
      },
      tenant: {
        name: { en: 'Karnataka' },
      },
      repository: {
        name: {
          en: 'Question Repository',
        },
      },
      taxonomy: {
        board: { name: { en: 'Central Board of Secondary Education' } },
        class: { name: { en: 'one' } },
        l1_skill: { name: { en: 'Addition' } },
        l2_skill: [{ name: { en: '1-digit Addition' } }],
        l3_skill: [{ name: { en: 'Horizontal addition by counting objects - sum up to 9' } }],
      },
      gradient: 'g4',
      benchmark_time: 40,
      sub_skills: [
        {
          name: {
            en: 'Procedural',
          },
        },
        {
          name: {
            en: 'x+0',
          },
        },
      ],
      media: [
        {
          fileName: 'Mcq_uplaod_image.png',
          mediaType: 'Image',
          mimeType: 'image/png',
          src: 'media/content',
        },
        {
          fileName: 'Mcq_uplaod_image1.png',
          mediaType: 'Image',
          mimeType: 'image/png',
          src: 'media/content',
        },
      ],

      question_body: {
        numbers: ['8012', '12'],
        showCarry: false,
        prefill: ['BB', 'FBB'],
        division_intermediate_steps_preFill: ['BB', 'BF', 'BB', 'BB'],
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
      },
    },
  },

  invalidRequest: {
    id: 'api.question.create',
    ver: '1.0',
    ts: '2021-02-02T19:28:24Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      qid: 'q0004',
      tenant: {
        id: 10,
        name: 'EkStep',
      },
      repository: {
        id: 1,
        name: 'AML',
      },

      operation: 'division',
      name: {
        en: 'This is question for Division',
        ka: 'ಇದು ವಿಭಜನೆಯ ಪ್ರಶ್ನೆಯಾಗಿದೆ',
        hi: 'यह प्रभाग के लिए प्रश्न है',
      },
      description: {
        en: 'This is description for the Question',
      },
      hints: {
        en: ['This is the hint for the question '],
      },
      solutions: {
        en: ['This is the solutions for the questions'],
      },
      taxonomy: {
        board: 'CBSE',
        class: 'Class-1',
        l1: 'division',
        l2: '4D',
        l3: '4D by 2D without reminder',
      },
      gradient: 4,
      version: '1.0',
      media: [
        {
          mediaType: 'image/png',
          mimeType: 'image',
          baseUrl: 'http://www.example.com/media',
          src: 'https://example.com/media/div.png',
        },
      ],
      body: {
        numbers: ['8012', '12'],
        showCarry: false,
        prefill: ['BB', 'FBB'],
        division_intermediate_steps_preFill: ['BB', 'BF', 'BB', 'BB'],
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
            option: '650, 0',
            subskill: ['carry'],
            value: 0,
          },
          {
            option: '510, 10',
            subskill: ['x+0'],
            value: 0,
          },
        ],
      },
    },
  },

  invalidSchemaRequest: {
    id: 'api.question.create',
    ver: '1.0',
    ts: '2021-02-02T19:28:24Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      qid: 'q0004',
      tenant: {
        id: 10,
        name: 'EkStep',
      },
      repository: {
        id: 1,
        name: 'AML',
      },

      operation: 'division',
      name: {
        en: 'This is question for Division',
        ka: 'ಇದು ವಿಭಜನೆಯ ಪ್ರಶ್ನೆಯಾಗಿದೆ',
        hi: 'यह प्रभाग के लिए प्रश्न है',
      },
      description: {
        en: 'This is description for the Question',
      },
      hints: {
        en: ['This is the hint for the question '],
      },
      solutions: {
        en: ['This is the solutions for the questions'],
      },
      taxonomy: {
        board: 'CBSE',
        class: 'Class-1',
        l1: 'division',
        l2: '4D',
        l3: '4D by 2D without reminder',
      },
      gradient: 4,
      version: '1.0',
      media: [
        {
          mediaType: 'image/png',
          mimeType: 'image',
          baseUrl: 'http://www.example.com/media',
          src: 'https://example.com/media/div.png',
        },
      ],
      body: {
        numbers: ['8012', '12'],
        showCarry: false,
        prefill: ['BB', 'FBB'],
        division_intermediate_steps_preFill: ['BB', 'BF', 'BB', 'BB'],
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
            option: '650, 0',
            subskill: ['carry'],
            value: 0,
          },
          {
            option: '510, 10',
            subskill: ['x+0'],
            value: 0,
          },
        ],
      },
    },
  },
};

export const update_question_request = {
  // Valid update request
  validRequest: {
    id: 'api.question.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      gradient: 'gi',
    },
  },

  // Invalid update request
  invalidRequest: {
    id: 'api.question.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      updated_by: 'some_user_id',
    },
  },
};

export const search_question_request = {
  validRequest: {
    id: 'api.question.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      filters: {
        question_type: ['mcq'],
      },
      limit: 10,
      offset: 0,
    },
  },

  invalidRequest: {
    id: 'api.question.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    request: {
      filters: {
        question_type: ['mcq'],
      },
      limit: 10,
      offset: 0,
    },
  },
};
