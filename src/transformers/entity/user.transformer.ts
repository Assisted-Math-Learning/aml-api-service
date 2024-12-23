import { User } from '../../models/users';

export class UserTransformer {
  private _user: User;
  constructor(user: User) {
    this._user = user;
  }

  transform() {
    return {
      email: this._user.email,
      first_name: this._user.first_name,
      last_name: this._user.last_name,
      role: this._user.role,
      identifier: this._user.identifier,
      tenant_id: this._user.tenant_id,
      is_active: this._user.is_active,
      created_by: this._user.created_by,
      updated_by: this._user.updated_by,
    };
  }
}
