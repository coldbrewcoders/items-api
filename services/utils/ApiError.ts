import { CustomError } from "ts-custom-error";
import HttpStatus from "http-status-codes";

class ApiError extends CustomError {

  // Additional member variables
  code: number;
  date: Date;

  constructor (message: string | Record<string, any>, httpStatusCode: number = HttpStatus.INTERNAL_SERVER_ERROR) {

    let serializedMessage: string;

    // If the message is not a string, stringify it to work with base Error class
    if (typeof(message) !== "string") {
      serializedMessage = JSON.stringify(message);
    }
    else {
      serializedMessage = message as string;
    }

    // Call constructor of base Error class
    super();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    // Assign constructor params to class fields
    this.message = serializedMessage;
    this.code = httpStatusCode;
    this.date = new Date();
  }

}

export default ApiError;