export interface User {
  uid: string;
  name: string;
}

export interface AuthUser extends User {
  token: string;
}
