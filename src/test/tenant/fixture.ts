export const tenant_request = {
  tenantCreate: {
    id: 'api.tenant.create',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: {
        en: 'Karnataka',
        hi: 'कर्नाटक',
      },
      type: {
        en: 'education',
        hi: 'शिक्षा',
      },
      board_id: [2],
    },
  },

  invalidTenantRequest: {
    id: 'api.tenant.create',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      type: 'Government',
      board_id: [1],
    }, // Missing the `name` field
  },

  invalidTenantSchema: {
    id: 'api.tenant.create',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: 123, // Invalid type for `name`, should be a string
      type: 'Government',
      board_id: [1, 2, 3],
    },
  },
};

export const updateTenatTenantBoard = {
  // Valid update request
  validTenantUpdateRequest: {
    id: 'api.tenant.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: { en: 'name1' },
    },
  },

  // Invalid update request
  invalidTenantUpdateRequest: {
    id: 'api.tenant.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    request: {
      name: { en: 'name1' },
    }, // Missing the `name` field
  },

  // Tenant does not exist
  tenantNotExistsRequest: {
    id: 'api.tenant.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: 'name',
      type: 'updated_type',
      // Ensure this field is excluded if not in the model
      // board_id: [1, 2, 3],
    },
  },
};

export const tenantSearch = {
  validTenantSearchrequest: {
    id: 'api.tenant.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      filters: {
        name: [{ en: 'Karnataka' }],
      },
      limit: 10,
      offset: 0,
    },
  },

  invalidSchemaSearchRequest: {
    id: 'api.tenant.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    request: {
      filters: { name: [1] },
      limit: 10,
      offset: 0,
    },
  },

  invalidfilterSearchRequest: {
    id: 'api.tenant.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    request: {
      filters: { live: [1] },
      limit: 10,
      offset: 0,
    },
  },
};
