import * as express from 'express';
import sections from './sections';
import courses from './courses';
import users from './users';
import auth from './auth';
import { logError, returnError } from '../middleware/errorHandler';

const router = express.Router();

router.use('/users', users);
router.use('', sections);
router.use('', courses);
router.use('', auth);

router.use(logError);
router.use(returnError);

export default router;