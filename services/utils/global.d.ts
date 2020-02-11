declare module "grpc-promise";

interface IMatchedData {
  [key: string]: string
}

interface ISessionValues {
  userId: number,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
}

declare namespace Express {
  export interface Request {
    matchedData?: IMatchedData,
    sessionValues?: ISessionValues,
  }
 }
