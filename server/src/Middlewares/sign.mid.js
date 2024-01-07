const { BadRequestError } = require("../Handlers/error.handler");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/;

/* In summary, when you add async to validateSignInData and validateSignUpData, it changes the way errors are propagated, making them work seamlessly with the error-catching mechanism in your handlerCatchError */

// Add async to catch errors
const validateSignUpData = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if required fields are present
  if (!name || !email || !password) {
    throw new BadRequestError("Name, email, and password are required fields");
  }

  // Validate name length
  if (name.length > 20) {
    throw new BadRequestError("Name should be at most 20 characters long");
  }

  // Validate email format
  if (!emailRegex.test(email)) {
    throw new BadRequestError("Invalid email format");
  }

  // Validate password length
  if (!passwordRegex.test(password)) {
    throw new BadRequestError(
      "Minimum eight characters, maximum thirty characters, at least one letter, one number and one special character"
    );
  }

  // If all validations pass, proceed to the next middleware or route handler
  next();
};

// Add async to catch errors
const validateSignInData = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if required fields are present
  if (!email || !password) {
    throw new BadRequestError("Email and password are required fields");
  }

  // Validate email format
  if (!emailRegex.test(email)) {
    throw new BadRequestError("Invalid email format");
  }

  // If all validations pass, proceed to the next middleware or route handler
  next();
};

module.exports = { validateSignInData, validateSignUpData };
