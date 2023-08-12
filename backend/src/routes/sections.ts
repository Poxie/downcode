import * as express from 'express';
import { Request, Response } from 'express';
import { Section } from '../entity/section.entity';
import { myDataSource } from '../app-data-source';

const router = express.Router();

export const getSection = async (id: string) => {
    const section = await myDataSource.getRepository(Section).findOne({
        where: { id },
        select: ['id', 'duration', 'durationIdentifier', 'xp', 'title', 'description', 'createdAt'],
    })
    return section;
}

router.get('/sections/:sectionId', async (req: Request, res: Response) => {
    const section = await getSection(req.params.sectionId);
    if(!section) return res.status(404).send({ message: 'Section not found.' });

    return res.json(section);
})

export default router;