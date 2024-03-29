const mongoose = require("mongoose");
const isLocal = require("../Helpers/checkNode.helper");

const CONNECT_STR = require("../Helpers/connectStrDB.helper");

let count = 0;
const MAX_RECONNECT = 3;
/**
 * Class representing a MongoDB database connection.
 */
class DataBase {
  /**
   * Creates an instance of the DataBase class and establishes a MongoDB connection.
   */
  constructor() {
    this.connect();
  }

  /**
   * Establishes a connection to the MongoDB database.
   * @param {boolean} isLocal - Indicates whether the application is running locally.
   */
  connect() {
    // Enable MongoDB debugging if running locally
    if (isLocal) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    // Connect to the MongoDB database
    mongoose
      .connect(CONNECT_STR, {
        maxPoolSize: 50,
      })
      .then(() => {
        count = 0;
        const connectionMessage = isLocal
          ? `Connecting to ${CONNECT_STR} successfully`
          : "Connecting to Database successfully";
        console.log(connectionMessage);
      })
      .catch((error) => {
        count++;
        if (count > MAX_RECONNECT) {
          console.error("Connection error");
          console.error(error);
        } else {
          console.log(`Reconnect count ${count} to database`);
          this.connect();
        }
      });
  }

  /**
   * Gets an instance of the DataBase class.
   * @returns {DataBase} - An instance of the DataBase class.
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new DataBase();
    }
    return this.instance;
  }
}

// Create a singleton instance of the DataBase class
const instanceDataBase = DataBase.getInstance();

// Export the singleton instance
module.exports = instanceDataBase;
