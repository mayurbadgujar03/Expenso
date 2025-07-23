import { body } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Email format is invalid"),

    body("username")
      .trim()
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
      .isLength({ max: 13 }).withMessage("Username cannot exceed 13 characters")
      .isAlphanumeric().withMessage("Username can only contain letters and numbers"),

    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/).withMessage("Password must contain at least one number")
      .matches(/[@$!%*?&#]/).withMessage("Password must contain at least one special character (@$!%*?&#)"),

    body("fullname")
      .trim()
      .notEmpty().withMessage("Full name is required")
      .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long")
      .matches(/^[a-zA-Z\s]+$/).withMessage("Full name must contain only letters and spaces"),
  ];
};

export { userRegistrationValidator };
