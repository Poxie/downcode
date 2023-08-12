import * as express from 'express';
import { Request, Response } from 'express';
import { Section } from '../entity/section.entity';
import { myDataSource } from '../app-data-source';
import { getUserIdFromHeaders } from '../utils/auth';
import { ALLOWED_SECTION_UPDATE_PROPS } from '../constants';
import { getCourse } from './courses';
import { createId } from '../utils';

const router = express.Router();

export const getSection = async (id: string) => {
    const section = await myDataSource.getRepository(Section).findOne({
        where: { id },
        select: ['id', 'duration', 'durationIdentifier', 'xp', 'title', 'description', 'createdAt'],
    })
    return section;
}

router.post(`/courses/:courseId/sections`, async (req: Request, res: Response) => {
    const course = await getCourse(req.params.courseId);
    if(!course) return res.status(404).send({ message: 'Course not found.' });

    const selfId = await getUserIdFromHeaders(req.headers);
    if(selfId !== course.authorId) return res.status(401).send({ message: 'Unauthorized.' });

    const sectionData = myDataSource.getRepository(Section).create({
        id: await createId('section'),
        courseId: course.id,
        createdAt: String(Date.now()),
    })
    const section = await myDataSource.getRepository(Section).save(sectionData);

    return res.json(section);
})

router.get('/sections/:sectionId', async (req: Request, res: Response) => {
    const section = await getSection(req.params.sectionId);
    if(!section) return res.status(404).send({ message: 'Section not found.' });

    return res.json(section);
})

router.patch('/sections/:sectionId', async (req: Request, res: Response) => {
    const section = await getSection(req.params.sectionId);
    if(!section) return res.status(404).send({ message: 'Section not found.' });
    
    // const selfId = await getUserIdFromHeaders(req.headers);

    // if(selfId !== course.author.id) return res.status(401).send({ message: 'Unauthorized.' });

    for(const key of Object.keys(req.body)) {
        if(!ALLOWED_SECTION_UPDATE_PROPS.includes(key)) {
            return res.status(400).send({ message: `${key} is an invalid property.` });
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