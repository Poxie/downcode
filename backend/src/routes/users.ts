import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { Request, Response } from 'express';
import { myDataSource } from '../app-data-source';
import { User } from '../entity/user.entity';
import { MAXIMUM_PASSWORD_LENGTH, MAXIMUM_USERNAME_LENGTH, MINIMUM_PASSWORD_LENGTH, MINIMUM_USERNAME_LENGTH, SALT_ROUNDS } from '../constants';

const router = express.Router();

// Function to get user
export const getUser = async (userId: string) => {
    const user = await myDataSource.getRepository(User).findOne({
        select: ['id', 'displayName', 'username', 'isStaff'],
        where: { id: userId }
    })
    return user;
}

// Function to create user id
const USER_ID_LENGTH = 10;
const createUserId = async () => {
    const opts = '0123456789';

    // Creating random id
    let id = ''
    for(let i = 0; i < USER_ID_LENGTH; i++) {
        id += opts[Math.ceil(Math.random() * opts.length) - 1]
    }

    // Checking if id is available
    if(await getUser(id)) {
        return await createUserId();
    }
    return id;
}

// Route to create new user
router.post("/", async (req: Request, res: Response) => {
    const { username, password, displayName }: {
        username?: string;
        password?: string;
        displayName?: string;
    } = req.body;

    if(!username) return res.status(400).send({ message: 'Username is a required field.' });
    if(!password) return res.status(400).send({ message: 'Password is a required field.' });
    
    if(await myDataSource.getRepository(User).findOneBy({ username })) {
        return res.status(403).send({ message: 'Username is unavailable.' });
    }

    if(username.length < MINIMUM_USERNAME_LENGTH || username.length > MAXIMUM_USERNAME_LENGTH) {
        return res.status(400).send({ message: `Username must have between ${MINIMUM_USERNAME_LENGTH} and ${MAXIMUM_USERNAME_LENGTH} characters.` });
    }
    if(password.length < MINIMUM_PASSWORD_LENGTH || password.length > MAXIMUM_PASSWORD_LENGTH) {
        return res.status(400).send({ message: `Password must have between ${MINIMUM_PASSWORD_LENGTH} and ${MAXIMUM_PASSWORD_LENGTH} characters.` });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Creating new user
    const newUser = myDataSource.getRepository(User).create({
        id: await createUserId(),
        username,
        password: hashedPassword,
        displayName,
    });
    await myDataSource.getRepository(User).save(newUser);

    // Fetching created user
    const user = await getUser(newUser.id);

    return res.send(user);
})

// Route to get all users
router.get("/", async (req: Request, res: Response) => {
    const users = await myDataSource.getRepository(User).find({
        select: ['id', 'displayName', 'username', 'isStaff']
    })
    res.json(users);
})

// Route to get logged in user
router.get('/@me', async (req: Request, res: Response) => {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (error, decoded: { 
        userId: string 
    }) => {
        if(error) return res.status(401).send({ message: 'User is unauthorized.' });

        const user = await getUser(decoded.userId);
        if(!user) return res.status(404).send({ message: 'User not found.' });

        return res.json(user);
    })
})

export default router;