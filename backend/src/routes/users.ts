import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as imageDataURI from 'image-data-uri';
import { Request, Response } from 'express';
import { myDataSource } from '../app-data-source';
import { User } from '../entity/user.entity';
import { ALLOWED_FILE_EXTENSIONS, ALLOWED_USER_UPDATE_PROPS, MAXIMUM_PASSWORD_LENGTH, MAXIMUM_USERNAME_LENGTH, MINIMUM_PASSWORD_LENGTH, MINIMUM_USERNAME_LENGTH, SALT_ROUNDS } from '../constants';
import { getUserIdFromHeaders } from '../utils/auth';
import { createId } from '../utils';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { APIForbiddenError } from '../errors/apiForbiddenError';
import { APIUnauthorizedError } from '../errors/apiUnauthorizedError';
import { APIInternalServerError } from '../errors/apiInternalServerError';
import { logError } from '../middleware/errorHandler';

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


// Route to create new user
router.post("/", async (req, res, next) => {
    const { username, password, displayName }: {
        username?: string;
        password?: string;
        displayName?: string;
    } = req.body;

    if(!username) return next(new APIBadRequestError('Username is a required field.'));
    if(!password) return next(new APIBadRequestError('Password is a required field.'));
    
    if(await myDataSource.getRepository(User).findOneBy({ username })) {
        return res.status(403).send({ message: 'Username is unavailable.' });
    }

    if(username.length < MINIMUM_USERNAME_LENGTH || username.length > MAXIMUM_USERNAME_LENGTH) {
        return next(new APIBadRequestError(`Username must have between ${MINIMUM_USERNAME_LENGTH} and ${MAXIMUM_USERNAME_LENGTH} characters.`));
    }
    if(password.length < MINIMUM_PASSWORD_LENGTH || password.length > MAXIMUM_PASSWORD_LENGTH) {
        return next(new APIBadRequestError(`Password must have between ${MINIMUM_PASSWORD_LENGTH} and ${MAXIMUM_PASSWORD_LENGTH} characters.`));
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Creating new user
    const newUser = myDataSource.getRepository(User).create({
        id: await createId('user'),
        username,
        password: hashedPassword,
        displayName,
        createdAt: String(Date.now()),
    });
    await myDataSource.getRepository(User).save(newUser);

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_PRIVATE_KEY);

    return res.json({ token });
})

// Route to get a specific user
router.get('/:userId', async (req, res, next) => {
    let userId = req.params.userId;

    const selfId = await getUserIdFromHeaders(req.headers);
    if(userId === 'me') userId = selfId;

    const user = await getUser(userId, selfId);
    if(!user) return next(new APINotFoundError('User not found.'));

    return res.json(user);
})

// Route to update a user
router.patch(`/:userId`, async (req, res, next) => {
    const selfId = await getUserIdFromHeaders(req.headers);
    let userId = req.params.userId === 'me' ? selfId : req.params.userId;

    if(!selfId) return next(new APIUnauthorizedError('Missing or invalid access token.'));
    if(userId !== selfId) return next(new APIForbiddenError('Missing access.'));

    const propsToUpdate = {};
    for(const [prop, value] of Object.entries(req.body as {[key: string]: any})) {
        if(!ALLOWED_USER_UPDATE_PROPS.includes(prop)) {
            return next(new APIBadRequestError(`${prop} is an invalid update property.`));
        }

        if(prop === 'avatar') {
            // If avatar value is null, remove current avatar
            if(!value) {
                propsToUpdate['avatar'] = null;
                continue;
            }

            // Checking if image type is supported
            if(!ALLOWED_FILE_EXTENSIONS.includes(value.split(':')[1].split(';')[0]?.toLowerCase())) {
                return next(new APIBadRequestError('The uploaded avatar file is an unsupported file type.'));
            }
            
            let avatarResponse: string;
            try {
                avatarResponse = await imageDataURI.outputFile(value, `./src/cdn/avatar/${selfId}-${Date.now()}`);
            } catch(error) {
                logError(error);
                return next(new APIInternalServerError('Unable to upload avatar.'));
            }

            propsToUpdate['avatar'] = avatarResponse.split('/').at(-1);
            continue;
        }
        
        if(prop === 'username') {
            if(value.length < MINIMUM_USERNAME_LENGTH) return next(new APIBadRequestError(`Username must contain at least ${MINIMUM_PASSWORD_LENGTH} characters.`));
            if(value.length > MAXIMUM_USERNAME_LENGTH) return next(new APIBadRequestError(`Username must contain a maximum of ${MAXIMUM_USERNAME_LENGTH} characters.`));
            if(await myDataSource.getRepository(User).findOneBy({ username: value })) {
                return next(new APIBadRequestError('Username is already taken.'));
            }
        }

        propsToUpdate[prop] = value;
    }

    if(!Object.keys(propsToUpdate).length) {
        return next(new APIBadRequestError('No properties to update were provided.'));
    }

    myDataSource.getRepository(User).update({ id: selfId }, propsToUpdate)
        .then(async () => {
            const user = await getUser(selfId);
            res.json(user);
        });
})

export default router;