import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { validationResult } from "express-validator";
import UserModel from "../models/User.js";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
    
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            passwordHash: newPasswordHash,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName,
        });
    
        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc;
    
        res.json({
            success: true,
            user: {
                token,
                ...userData
            }
        });
    } catch (error) {
        console.error('register_failed', error)
        res.status(500).json({
            success: false,
            error,
            message: 'register_failed'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email
        })

        if (!user) {
            return res.status(400).json({
                message: 'user_not_found' // not use in production 
                // message: 'user_or_password_wrong'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'user_or_password_wrong'
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc;
    
        res.json({
            success: true,
            user: {
                token,
                ...userData
            }
        });
    } catch (error) {
        console.error('auth_failed', error)
        res.status(500).json({
            success: false,
            error,
            message: 'auth_failed'
        })
    }
}

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'user_not_found'
            });
        }

        const { passwordHash, ...userData } = user._doc;

        res.json({
            success: true,
            user: {
                ...userData
            }
        });
    } catch (error) {
        console.error('me_failed', error)
        res.status(500).json({
            success: false,
            error,
            message: 'me_failed'
        })
    }
}