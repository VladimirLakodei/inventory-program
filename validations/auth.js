import { body } from 'express-validator';

const registerValidator = [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').isLength({ min: 2 }),
    body('lastName').isLength({ min: 2 }),
    body('middleName').isLength({ min: 2 }),
    // body('avatarUrl').optional().isURL(),
];

export { registerValidator };
