import { CustomError } from "ts-custom-error";


class ApiError extends CustomError {

  // Additional member variables
  code: number;
  context: any;
  date: Date;

  constructor(message: string | Object, httpStatusCode: number = 500, context?: any) {

    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    // Assign constructor params to class fields
    this.message = message;
    this.code = httpStatusCode;
    this.context = context;
    this.date = new Date();
  }

}

export default ApiError;