import * as express from 'express';
import sections from './sections';
import courses from './courses';
import users from './users';
import auth from './auth';

const router = express.Router();

router.use('/users', users);
router.use('', sections);
router.use('', courses);
router.use('', auth);

export default router;