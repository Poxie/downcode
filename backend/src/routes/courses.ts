import * as express from 'express';
import { Request, Response } from 'express';
import { getUserIdFromHeaders } from '../utils/auth';
import { myDataSource } from '../app-data-source';
import { Course } from '../entity/course.entity';
import { ALLOWED_COURSE_TYPES, ALLOWED_COURSE_UPDATE_PROPS } from '../constants';
import { createId } from '../utils';

const router = express.Router();

export const getCourse = async (id: string) => {
    const course = await myDataSource.getRepository(Course).findOne({
        where: { id },
        select: ['id', 'author', 'title', 'description', 'skillLevel', 'type', 'status', 'publishedAt', 'createdAt'],
        relations: ['author'],
    })
    return course;
}

router.post('/users/:userId/courses', async (req: Request, res: Response) => {
    const selfId = await getUserIdFromHeaders(req.headers);
    const userId = req.params.userId === 'me' ? selfId : req.params.userId;

    if(selfId !== userId) return res.status(401).send({ message: 'Unauthorized.' });

    const courseData = myDataSource.getRepository(Course).create({
        id: await createId('course'),
        authorId: userId,
        createdAt: String(Date.now()),
    })
    const course = await myDataSource.getRepository(Course).save(courseData);

    return res.json(course);
})

router.get('/users/:userId/courses', async (req: Request, res: Response) => {
    // Important not to remove the if statement below, since 'as Course["type"]' is being used here
    const type = (req.query.type || 'course') as Course['type'];
    if(!ALLOWED_COURSE_TYPES.includes(type)) return res.status(400).send({ message: 'Invalid course type provided.' });

    const selfId = await getUserIdFromHeaders(req.headers);
    const userId = req.params.userId === 'me' ? selfId : req.params.userId;

    if(selfId !== userId) return res.status(401).send({ message: 'Unauthorized.' });

    const courses = await myDataSource.getRepository(Course).find({
        where: { type, authorId: userId },
        select: ['id', 'author', 'type', 'status', 'title', 'description', 'skillLevel', 'createdAt', 'publishedAt']
    });

    return res.json(courses);
})

router.patch('/courses/:courseId', async (req: Request, res: Response) => {
    const course = await getCourse(req.params.courseId);
    if(!course) return res.status(404).send({ message: 'Course not found.' });
    
    const selfId = await getUserIdFromHeaders(req.headers);

    if(selfId !== course.author.id) return res.status(401).send({ message: 'Unauthorized.' });

    for(const key of Object.keys(req.body)) {
        if(!ALLOWED_COURSE_UPDATE_PROPS.includes(key)) {
            return res.status(400).send({ message: `${key} is an invalid property.` });
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