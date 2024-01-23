//Libs
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

//Funcs
const { NotFoundRequestError } = require("./Handlers/error.handler");
const isLocal = require("./Helpers/checkNode.helper");

//Vars
const app = express();

// Configuration
const corsConfig = {
  origin: process.env.CLIENT_URL || "*", // Use '*' for any origin in development
  credentials: true,
};
const compressionConfig = { chunkSize: 1024, level: 2 };

function main() {
  //Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(isLocal ? "dev" : "combined"));
  app.use(cors(corsConfig));
  app.use(compression(compressionConfig));
  app.use(helmet());

  //Databases
  require("./Databases/init.mongo");

  //Routes
  app.get("/", (_, res) =>
    res.status(StatusCodes.OK).json({
      route: "/",
      status: "success",
      message: "Reply form server",
    })
  );
  app.use("/v1/api/account", require("./Routes/access.route"));
  app.use("/v1/api/product", require("./Routes/product.route"));

  //Error handler
  app.use((req, res, next) => {
    const error = new NotFoundRequestError();
    next(error);
  });

  app.use((error, req, res, next) => {
    const defaultStatusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    const statusCode = error.status || defaultStatusCode;
    const message =
      statusCode === defaultStatusCode
        ? ReasonPhrases.INTERNAL_SERVER_ERROR
        : error.message;

    // Log the error for production debugging
    console.error(error);

    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      message,
      stack: isLocal ? [error.stack] : [],
    });
  });
}

main();

module.exports = app;
