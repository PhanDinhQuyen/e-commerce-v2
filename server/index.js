"use strict";

/**
 * Represents the start time of the server.
 *
 * @type {Date}
 */
let startTime = new Date();

console.log(`${startTime} - Start server`);
startTime = null;

require("dotenv").config();

/**
 * Represents the Express application.
 *
 * @type {Object}
 */
const app = require("./src/app");

/**
 * Represents the port number the server listens on.
 *
 * @type {number}
 */
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

process.on("SIGINT", () => {
  /**
   * Represents the exit time of the server.
   *
   * @type {Date}
   */
  const exitTime = new Date();

  console.log(`${exitTime} - Exit server`);
  process.exit(0);
});
