/**
 * Represents the current environment based on the NODE_ENV environment variable.
 *
 * @param {boolean} isLocal - Indicates whether the environment is set to "local".
 */
const isLocal = process.env.NODE_ENV === "local";
console.log(["isLocal", isLocal]);

module.exports = isLocal;
