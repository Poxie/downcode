import * as express from 'express';
import users from './users';
import auth from './auth';

const router = express.Router();

router.use('/users', users);
router.use('', auth);

export default router;