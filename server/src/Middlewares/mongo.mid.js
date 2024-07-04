// const { BadRequestError } = require("../Handlers/error.handler");

function sanitize(obj) {
  if (obj instanceof Object) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (/^\$/.test(key)) {
          delete obj[key];
          // throw new BadRequestError();
          console.log(["Warning", "Alert noSQL injection"]);
        } else {
          sanitize(obj[key]);
        }
      }
    }
  }
  return obj;
}

module.exports = sanitize;
