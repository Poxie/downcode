import * as express from 'express';
import courses from './courses';
import users from './users';
import auth from './auth';

const router = express.Router();

router.use('/users', users);
router.use('', courses);
router.use('', auth);

export default router;