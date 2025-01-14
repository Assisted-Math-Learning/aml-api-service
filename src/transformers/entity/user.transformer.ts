import { User } from '../../models/users';

export class UserTransformer {
  transform(user: User) {
    return {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      identifier: user.identifier,
      tenant_id: user.tenant_id,
      is_active: user.is_active,
      created_by: user.created_by,
      updated_by: user.updated_by,
    };
  }

  transformList(users: User[]) {
    return users.map((user) => this.transform(user));
  }
}
