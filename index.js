import express from "express";
import mongoose from "mongoose";

import checkAuth from "./utils/checkAuth.js";
import { registerValidator } from "./validations/auth.js";
import { me, login, register } from "./controllers/UserController.js"

console.log('process.env.DB_CS', process.env.DB_CS)

mongoose.connect(
    process.env.DB_CS
).then(() => {
    console.log('DB OK');
}).catch((error) => {
    console.log(`DB error ${error}`);
});

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('auth app');
});

app.post('/auth/login', login);

app.post('/auth/register', registerValidator, register);

app.get('/auth/me', checkAuth, me);

app.listen(4444, (error) => {
    if (error) {
        return console.log(error);
    }

    console.log('Server OK');
});
