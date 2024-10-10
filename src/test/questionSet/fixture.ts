export const insert_questionset_request = {
  validRequest: {
    id: 'api.questionSet.create',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: 'b68dc3a5-f37f-4d69-b4f3-555408c2fab2',
    },
    request: {
      title: {
        en: 'Question Set 1',
      },
      description: {
        en: 'This is a question description',
      },
      tenant: {
        name: {
          en: 'Karnataka',
        },
      },
      repository: {
        name: {
          en: 'Question Repository',
        },
      },
      questions: [
        { identifier: 'a6d437ce-85b3-4880-9481-4f5e588c0d56', sequence: 1 },
        { identifier: '8603bdec-1df7-4911-b5e1-28a333e59027', sequence: 2 },
      ],
      sequence: 1,
      taxonomy: {
        board: {
          name: {
            en: 'Central Board of Secondary Education',
          },
        },
        class: {
          name: {
            en: 'Class One',
          },
        },
        l1_skill: {
          name: {
            en: 'Addition',
          },
        },
        l2_skill: [
          {
            name: {
              en: '1-digit Addition',
            },
          },
        ],
        l3_skill: [
          {
            name: {
              en: '2Dx1D with carry (non-zero digits)',
            },
          },
        ],
      },
      sub_skills: [
        {
          name: {
            en: 'Geometry Basics',
          },
        },
      ],
      purpose: 'Practice',
      is_atomic: false,
      gradient: 'g1',
      group_name: 1,
      instruction_text: 'text',
    },
  },

  invalidRequest: {
    id: 'api.questionSet.create',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: 'b68dc3a5-f37f-4d69-b4f3-555408c2fab2',
    },
    request: {
      title: {
        en: 'Question Set 1',
      },
      description: {
        en: 'This is a question description',
      },
      tenant: {
        name: {
          en: 'board1',
        },
      },
      repository: {
        name: {
          en: 'Question Repository',
        },
      },
      sequence: 1,
      taxonomy: {
        board: {
          name: {
            en: 'Central Board of Secondary Education',
          },
        },
        class: {
          name: {
            en: 'Class One',
          },
        },
        l1_skill: {
          name: {
            en: 'Addition',
          },
        },
        l2_skill: [
          {
            name: {
              en: '1-digit Addition',
            },
          },
        ],
        l3_skill: [
          {
            name: {
              en: '2Dx1D with carry (non-zero digits)',
            },
          },
        ],
      },
      sub_skills: [
        {
          name: {
            en: 'Procedural',
          },
        },
        {
          name: {
            en: 'Geometry Basics',
          },
        },
      ],
      purpose: 'Practice',
      is_atomic: false,
      gradient: 1,
      group_name: 1,
      instruction_text: 1,
    },
  },

  invalidSchemaRequest: {
    id: 'api.questionSet.create',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: 'b68dc3a5-f37f-4d69-b4f3-555408c2fab2',
    },
    request: {
      title: {
        en: 'Question Set 1',
      },
      description: {
        en: 'This is a question description',
      },
      tenant: {
        name: {
          en: 'board1',
        },
      },
      repository: {
        name: {
          en: 'Question Repository',
        },
      },
    },
  },
};

export const update_question_set_request = {
  // Valid update request
  validRequest: {
    id: 'api.questionSet.update',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: 'b68dc3a5-f37f-4d69-b4f3-555408c2fab2',
    },
    request: {
      title: {
        en: 'Question Set 1',
      },
      description: {
        en: 'This is a question description1',
      },
    },
  },

  // Invalid update request
  invalidRequest: {
    id: 'api.questionSet.update',
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

export const search_questionSet_request = {
  validRequest: {
    id: 'api.questionSet.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      filters: {
        title: [{ en: 'Question Set 1' }, { en: 'Question Set 2' }],
      },
      limit: 10,
      offset: 0,
    },
  },

  invalidRequest: {
    id: 'api.questionSet.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    request: {
      filters: {
        question_set_id: ['q1'],
      },
      limit: 10,
      offset: 0,
    },
  },
};
