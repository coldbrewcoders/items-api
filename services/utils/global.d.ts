declare module "grpc-promise";

interface IMatchedData {
  [key: string]: string;
}

interface ISessionValues {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface IEmailNotification {
  email: string;
  firstName: string;
  subject: string;
  messageHeader: string;
  messageBody: string;
}

declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  export interface Request {
    matchedData?: IMatchedData;
    sessionValues?: ISessionValues;
  }
}