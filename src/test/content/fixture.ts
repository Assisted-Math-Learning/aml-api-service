export const insert_content_request = {
  validRequest: {
    id: 'api.content.create',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: {
        en: 'content 1',
        ta: 'உள்ளடக்கம் 1',
        te: 'సమగ్రత 1',
      },
      description: {
        en: 'This is the description for the content',
        ta: 'இது உள்ளடக்கத்திற்கான விளக்கம்',
        te: 'ఈ కంటెంట్ కోసం వివరణ',
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
      gradient: 'g4',
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
    },
  },

  invalidRequest: {
    id: 'api.content.create',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: {
        en: 'content 1',
        ta: 'உள்ளடக்கம் 1',
        te: 'సమగ్రత 1',
      },
      description: {
        en: 'This is the description for the content',
        ta: 'இது உள்ளடக்கத்திற்கான விளக்கம்',
        te: 'ఈ కంటెంట్ కోసం వివరణ',
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
      gradient: 4,
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
    },
  },

  invalidSchemaRequest: {
    id: 'api.content.create',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      content_id: 'c001',
      name: {
        en: 'content 1',
        ta: 'உள்ளடக்கம் 1',
        te: 'సమగ్రత 1',
      },
      description: {
        en: 'This is the description for the content',
        ta: 'இது உள்ளடக்கத்திற்கான விளக்கம்',
        te: 'ఈ కంటెంట్ కోసం వివరణ',
      },
      tenant: {
        name: {
          en: 'Karnataka',
        },
      },
    },
  },
};

export const update_content_request = {
  // Valid update request
  validRequest: {
    id: 'api.content.create',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: {
        en: 'content 2',
        ta: 'உள்ளடக்கம் 1',
        te: 'సమగ్రత 1',
      },
    },
  },

  // Invalid update request
  invalidRequest: {
    id: 'api.content.update',
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

export const search_content_request = {
  validRequest: {
    id: 'api.content.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      filters: {
        name: [{ en: 'cont' }],
      },
      limit: 10,
      offset: 0,
    },
  },

  invalidRequest: {
    id: 'api.content.search',
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
