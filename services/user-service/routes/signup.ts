// import express, { Request, Response, NextFunction } from "express";
// import { body } from "express-validator";
// import HttpStatus from "http-status-codes";

// // Middleware
// import { validationCheck } from "../middleware/validation";

// // Repository
// import { addUser } from "../repository/queries";
// import { generatePasswordHash } from "../repository/crypt";

// // Utils
// import ApiError from "../../utils/ApiError";

// // Create express router
// const router = express.Router();


// router.post("/", [

//   body("email")
//     .isEmail()
//     .isLength({ min: 1, max: 100 }),

//   body("password")
//     .isLength({ min: 1, max: 100 }),

//   body("firstName")
//     .isLength({ min: 1, max: 100 }),

//   body("lastName")
//     .isLength({ min: 1, max: 100 }),

//   body("role")
//     .isIn(["BASIC", "ADMIN"])

// ], validationCheck, async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Get validated request data
//     const { email, password, firstName, lastName, role } = req.matchedData;

//     // Generate safe password for storage
//     const safePasswordHash = await generatePasswordHash(password);

//     // Send 500 if error occurred creating safe password hash
//     if (!safePasswordHash) throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);

//     // Add new user to the DB
//     const result = await addUser(email, safePasswordHash, firstName, lastName, role);

//     if (result.name === "error") {

//       // Check if email unique constraint was violated
//       if (result.constraint === "users_email_key") {
//         throw new ApiError("A user with this email address already exists.", HttpStatus.CONFLICT);
//       }

//       throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
//     }

//     res.sendStatus(200).end();
//   }
//   catch (error) {
//     // Go to the error handling middleware with the error
//     return next(error);
//   }
// });


// export default router;