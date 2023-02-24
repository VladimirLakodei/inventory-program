import { body } from 'express-validator';

const actValidator = [
    body('number', 'act_number_invalid').isString().isLength({ min: 1 }),
    body('title', 'title_number_invalid').isString().isLength({ min: 1 }),
    body('description').optional(),
    body('location', 'act_location_invalid').isString().isLength({ min: 2 }),
    body('materiallyResponsible', 'act_materially_responsible_invalid').isString().isLength({ min: 2 }),
];

export { actValidator };
