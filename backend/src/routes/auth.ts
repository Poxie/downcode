import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { Request, Response } from 'express';
import { myDataSource } from '../app-data-source';
import { User } from '../entity/user.entity';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
    const { username, password }: {
        username?: string;
        password?: string;
    } = req.body;

    if(!username) return res.status(400).send({ message: 'Username is a required field.' });
    if(!password) return res.status(400).send({ message: 'Password is a required field.' });

    const user = await myDataSource.getRepository(User).findOneBy({ username });

    if(!user) return res.status(401).send({ message: 'Credentials do not match.' });

    const hashedPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    
    if(!isMatch) return res.status(401).send({ message: 'Credentials do not match.' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_PRIVATE_KEY)

    return res.json({ token });
})

export default router;