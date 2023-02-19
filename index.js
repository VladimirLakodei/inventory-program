import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import checkAuth from "./utils/checkAuth.js";
import checkPermission from "./utils/checkPermission.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import { actValidator } from "./validations/act.js";
import { loginValidator, registerValidator } from "./validations/auth.js";
import * as ActController from "./controllers/ActController.js"
import * as UserController from "./controllers/UserController.js"

mongoose.connect(
    process.env.DB_CS
).then(() => {
    console.log('DB OK');
}).catch((error) => {
    console.log(`DB error ${error}`);
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('inventory app');
});

app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/acts', checkPermission, ActController.getAll);
app.get('/acts/:id', checkPermission, ActController.getOne);
app.post('/acts', checkAuth, actValidator, handleValidationErrors, ActController.create);
app.patch('/acts/:id', checkAuth, actValidator, handleValidationErrors, ActController.update);
app.delete('/acts/:id', checkAuth, ActController.remove);

app.listen(4444, (error) => {
    if (error) {
        return console.log(error);
    }

    console.log('Server OK');
});
