import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { Request, Response } from 'express';
import { myDataSource } from '../app-data-source';
import { User } from '../entity/user.entity';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { APIUnauthorizedError } from '../errors/apiUnauthorizedError';

const router = express.Router();

router.post('/login', async (req, res, next) => {
    const { username, password }: {
        username?: string;
        password?: string;
    } = req.body;

    if(!username) return next(new APIBadRequestError('Username is a required field.'));
    if(!password) return next(new APIBadRequestError('Password is a required field.'));

    const user = await myDataSource.getRepository(User).findOneBy({ username });

    if(!user) return next(new APIUnauthorizedError('Credentials do not match.'));

    const hashedPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    
    if(!isMatch) return next(new APIUnauthorizedError('Credentials do not match.'));

    const token = jwt.sign({ userId: user.id }, process.env.JWT_PRIVATE_KEY)

    return res.json({ token });
})

export default router;