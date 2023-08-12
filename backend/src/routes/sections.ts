import * as express from 'express';
import { Request, Response } from 'express';
import { Section } from '../entity/section.entity';
import { myDataSource } from '../app-data-source';
import { getUserIdFromHeaders } from '../utils/auth';
import { ALLOWED_SECTION_UPDATE_PROPS } from '../constants';
import { getCourse } from './courses';
import { createId } from '../utils';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { APIUnauthorizedError } from '../errors/apiUnauthorizedError';
import { APIForbiddenError } from '../errors/apiForbiddenError';
import { APIBadRequestError } from '../errors/apiBadRequestError';

const router = express.Router();

export const getSection = async (id: string) => {
    const section = await myDataSource.getRepository(Section).findOne({
        where: { id },
        select: ['id', 'duration', 'durationIdentifier', 'xp', 'title', 'description', 'createdAt'],
    })
    return section;
}

router.post(`/courses/:courseId/sections`, async (req, res, next) => {
    const course = await getCourse(req.params.courseId);
    if(!course) return next(new APINotFoundError('Course not found.'));

    const selfId = await getUserIdFromHeaders(req.headers);
    if(!selfId) return next(new APIUnauthorizedError('Missing or invalid access token.'));
    if(course.author.id !== selfId) return next(new APIForbiddenError('Missing access.'));

    const sectionData = myDataSource.getRepository(Section).create({
        id: await createId('section'),
        courseId: course.id,
        createdAt: String(Date.now()),
    })
    const section = await myDataSource.getRepository(Section).save(sectionData);

    return res.json(section);
})

router.get('/sections/:sectionId', async (req, res, next) => {
    const section = await getSection(req.params.sectionId);
    if(!section) return next(new APINotFoundError('Section not found.'));

    return res.json(section);
})

router.patch('/sections/:sectionId', async (req, res, next) => {
    const section = await getSection(req.params.sectionId);
    if(!section) return next(new APINotFoundError('Section not found.'));
    
    // const selfId = await getUserIdFromHeaders(req.headers);

    // if(selfId !== course.author.id) return res.status(401).send({ message: 'Unauthorized.' });

    for(const key of Object.keys(req.body)) {
        if(!ALLOWED_SECTION_UPDATE_PROPS.includes(key)) {
            return next(new APIBadRequestError(`${key} is an invalid property.`));
        }
    }

    await myDataSource.getRepository(Section).update(
        { id: section.id },
        req.body
    )
    const updatedSection = await getSection(section.id);

    return res.json(updatedSection);
})

export default router;