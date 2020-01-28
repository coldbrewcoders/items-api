const { authServiceGrpcClient } = require("../config/grpc_config");


const isAuthenticated = (req, res, next) => {

  authServiceGrpcClient.checkIsUserAuthed({ sessionToken: "sessionToken" }, (error, { isAuthenticated }) => {

    if (error) {
      console.error(error);
      res.status(500).end();
    }

    if (isAuthenticated) {
      return next();
    }
    else {
      res.status(401);
    }

  });

}

const isAuthenticatedAdmin = (req, res, next) => {

  authServiceGrpcClient.checkIsUserAuthed({ sessionToken: "sessionToken" }, (error, { isAuthenticated, userRole }) => {

    if (error) {
      console.error(error);
      res.status(500).end();
    }

    if (isAuthenticated) {

      if (userRole === "Admin") {
        next();
      }

      res.status(403).end();
    }
    else {
      res.status(401).end();
    }

  });

}


module.exports = {
  isAuthenticated,
  isAuthenticatedAdmin
};