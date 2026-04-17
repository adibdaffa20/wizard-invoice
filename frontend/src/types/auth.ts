export type UserRole = "admin" | "kerani";

export type DecodedToken = {
  user_id: number;
  role: UserRole;
  exp: number;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};