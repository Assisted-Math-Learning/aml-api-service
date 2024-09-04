export const insert_tenant_request = {
  tenantCreate: {
    id: 'api.datasets.create',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: 'mumbai',
      type: 'Government',
      board_id: [1, 2, 3],
    },
  },
  invalidTenantRequest: {
    id: 'api.datasets.create',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      type: 'Government',
      board_id: [1, 2, 3],
    }, // Missing the `name` field
  },
  invalidTenantSchema: {
    id: 'api.datasets.create',
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
      name: 'name',
      type: 'updated_type',
      // Ensure this field is excluded if not in the model
      // board_id: [1, 2, 3],
    },
  },

  // Invalid update request
  invalidTenantUpdateRequest: {
    id: 'api.tenant.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      // Missing required fields
      updated_by: 'some_user_id',
      // Missing 'name' and 'type' which are required
    },
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
      updated_by: 'some_user_id',
      name: 'name',
      type: 'updated_type',
      // Ensure all required fields are included
    },
  },
};

export const tenantSearch = {
  validTenantSearchrequest: {
    key: 'tenant',
    filters: {
      type: 'government',
      offset: 0,
      limit: 5,
    },
  },

  validTenantBoardSearchRequest: {
    key: 'tenant_board',
    filters: {
      name: 'new baord',
      is_active: true,
      offset: 0,
      limit: 5,
    },
  },

  invalidSchemaSearchRequest: {
    key: 'tenant_bo',
    filters: {
      name: 'new baord',
      is_active: true,
      offset: 0,
      limit: 5,
    },
  },
  invalidTenantBoardSearchRequest: {
    key: 'tenant_board',
    filters: {
      names: 'new baord',
      is_active: true,
      offset: 0,
      limit: 5,
    },
  },
};
