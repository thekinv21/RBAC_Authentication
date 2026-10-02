export type TJwtPayload = {
  sub: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
};
