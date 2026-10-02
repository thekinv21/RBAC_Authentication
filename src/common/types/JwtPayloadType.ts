export type TJwtPayload = {
  sub: string;
  fullName: string;
  roles: string[];
  tokenVersion: number;
  iat?: number;
  exp?: number;
};
