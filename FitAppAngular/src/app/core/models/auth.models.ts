export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean; // Optional field
}

export interface LoginResponse {
  token: string;
  expiration: string;
  user: {
    id: string;
    userName: string;
  };
}