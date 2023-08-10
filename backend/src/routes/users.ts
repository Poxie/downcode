import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as imageDataURI from 'image-data-uri';
import { Request, Response } from 'express';
import { myDataSource } from '../app-data-source';
import { User } from '../entity/user.entity';
import { ALLOWED_FILE_EXTENSIONS, ALLOWED_USER_UPDATE_PROPS, MAXIMUM_PASSWORD_LENGTH, MAXIMUM_USERNAME_LENGTH, MINIMUM_PASSWORD_LENGTH, MINIMUM_USERNAME_LENGTH, SALT_ROUNDS } from '../constants';

const router = express.Router();

// Function to get user
export const getUser = async (userId: string | null, selfId?: string) => {
    if(!userId) return;

    const user = await myDataSource.getRepository(User).findOne({
        select: ['id', 'displayName', 'username', 'avatar', 'isStaff', 'createdAt'],
        where: { id: userId }
    })
    if(!user) return user;

    return {
        ...user,
        isSelf: user.id === selfId
    };
}

// Function to get userId from auth headers
const getUserIdFromHeaders: ((headers: Request['headers']) => Promise<string | null>) = (headers) => {
    const accessToken = headers.authorization.split(' ')[1];

    return new Promise((res, rej) => {
        jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY, async (error, decoded?: { 
            userId: string 
        }) => {
            if(error || !decoded) return res(null);
            res(decoded.userId);
        })
    })
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
        createdAt: String(Date.now()),
    });
    await myDataSource.getRepository(User).save(newUser);

    // Fetching created user
    const selfId = await getUserIdFromHeaders(req.headers);
    const user = await getUser(newUser.id, selfId);

    return res.send(user);
})

// Route to get a specific user
router.get('/:userId', async (req: Request, res: Response) => {
    let userId = req.params.userId;

    const selfId = await getUserIdFromHeaders(req.headers);
    if(userId === 'me') userId = selfId;

    const user = await getUser(userId, selfId);
    if(!user) return res.status(404).send({ message: 'User not found.' });

    return res.json(user);
})

// Route to update a user
router.patch(`/:userId`, async (req: Request, res: Response) => {
    const selfId = await getUserIdFromHeaders(req.headers);
    let userId = req.params.userId === 'me' ? selfId : req.params.userId;

    if(userId !== selfId) return res.status(401).send({ message: 'Unauthorized.' });

    const propsToUpdate = {};
    for(const [prop, value] of Object.entries(req.body as {[key: string]: any})) {
        if(!ALLOWED_USER_UPDATE_PROPS.includes(prop)) {
            return res.status(400).send({ message: `${prop} is an invalid update property.` });
        }

        if(prop === 'avatar') {
            // If avatar value is null, remove current avatar
            if(!value) {
                propsToUpdate['avatar'] = null;
                continue;
            }

            // Checking if image type is supported
            if(!ALLOWED_FILE_EXTENSIONS.includes(value.split(':')[1].split(';')[0]?.toLowerCase())) {
                return res.status(400).send({ message: 'The uploaded avatar file is an unsupported file type.' });
            }
            
            let avatarResponse: string;
            try {
                avatarResponse = await imageDataURI.outputFile(value, `./src/cdn/avatar/${selfId}-${Date.now()}`);
            } catch(error) {
                console.error(error);
                return res.status(500).send({ message: 'Unable to upload avatar.' });
            }

            propsToUpdate['avatar'] = avatarResponse.split('/').at(-1);
            continue;
        }
        
        if(prop === 'username') {
            if(value.length < MINIMUM_USERNAME_LENGTH) return res.status(400).send({ message: `Username must contain at least ${MINIMUM_PASSWORD_LENGTH} characters.` });
            if(value.length > MAXIMUM_USERNAME_LENGTH) return res.status(400).send({ message: `Username must contain a maximum of ${MAXIMUM_USERNAME_LENGTH} characters.` });
            if(await myDataSource.getRepository(User).findOneBy({ username: value })) {
                return res.status(403).send({ message: 'Username is already taken.' });
            }
        }

        propsToUpdate[prop] = value;
    }

    if(!Object.keys(propsToUpdate).length) {
        return res.status(400).send({ message: 'No properties to update were provided.' });
    }

    myDataSource.getRepository(User).update({ id: selfId }, propsToUpdate)
        .then(async () => {
            const user = await getUser(selfId);
            res.json(user);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send({ message: 'An internal error occured.' });
        });
})

export default router;