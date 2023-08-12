import * as express from 'express';
import { Request, Response } from 'express';
import { getUserIdFromHeaders } from '../utils/auth';
import { myDataSource } from '../app-data-source';
import { Course } from '../entity/course.entity';
import { ALLOWED_COURSE_TYPES, ALLOWED_COURSE_UPDATE_PROPS } from '../constants';
import { createId } from '../utils';
import { Section } from '../entity/section.entity';
import { APIUnauthorizedError } from '../errors/apiUnauthorizedError';
import { APIForbiddenError } from '../errors/apiForbiddenError';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { APINotFoundError } from '../errors/apiNotFoundError';

const router = express.Router();

export const getCourse = async (id: string) => {
    const course = await myDataSource.getRepository(Course).findOne({
        where: { id },
        select: ['id', 'author', 'authorId', 'sections', 'title', 'description', 'skillLevel', 'type', 'status', 'publishedAt', 'createdAt'],
        relations: ['author', 'sections'],
    })
    return course;
}

router.post('/users/:userId/courses', async (req, res, next) => {
    const selfId = await getUserIdFromHeaders(req.headers);
    const userId = req.params.userId === 'me' ? selfId : req.params.userId;

    if(!selfId) return next(new APIUnauthorizedError('Missing or invalid access token.'));
    if(userId !== selfId) return next(new APIForbiddenError('Missing access.'));

    const courseData = myDataSource.getRepository(Course).create({
        id: await createId('course'),
        authorId: userId,
        createdAt: String(Date.now()),
    })
    const sectionData = myDataSource.getRepository(Section).create({
        id: await createId('section'),
        courseId: courseData.id,
        createdAt: String(Date.now()),
    })

    await myDataSource.getRepository(Section).save(sectionData);
    await myDataSource.getRepository(Course).save(courseData);

    const course = await getCourse(courseData.id);

    return res.json(course);
})

router.get('/users/:userId/courses', async (req, res, next) => {
    // Important not to remove the if statement below, since 'as Course["type"]' is being used here
    const type = (req.query.type || 'course') as Course['type'];
    if(!ALLOWED_COURSE_TYPES.includes(type)) return next(new APIBadRequestError('Invalid course type provided.'));

    const selfId = await getUserIdFromHeaders(req.headers);
    const userId = req.params.userId === 'me' ? selfId : req.params.userId;

    if(!selfId) return next(new APIUnauthorizedError('Missing or invalid access token.'));
    if(userId !== selfId) return next(new APIForbiddenError('Missing access.'));

    const courses = await myDataSource.getRepository(Course).find({
        where: { type, authorId: userId },
        select: ['id', 'author', 'type', 'status', 'title', 'description', 'skillLevel', 'createdAt', 'publishedAt'],
        relations: ['author', 'sections'],
    });

    return res.json(courses);
})

router.patch('/courses/:courseId', async (req, res, next) => {
    const course = await getCourse(req.params.courseId);
    if(!course) return next(new APINotFoundError('Course not found.'));
    
    const selfId = await getUserIdFromHeaders(req.headers);

    if(!selfId) return next(new APIUnauthorizedError('Missing or invalid access token.'));
    if(course.author.id !== selfId) return next(new APIForbiddenError('Missing access.'));

    for(const key of Object.keys(req.body)) {
        if(!ALLOWED_COURSE_UPDATE_PROPS.includes(key)) {
            return next(new APIBadRequestError(`${key} is an invalid property.`));
        }
    }

    await myDataSource.getRepository(Course).update(
        { id: course.id },
        req.body
    )
    const updatedCourse = await getCourse(course.id);

    return res.json(updatedCourse);
})

export default router;