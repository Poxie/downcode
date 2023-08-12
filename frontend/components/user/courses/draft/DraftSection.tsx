import { Dropdown } from '@/components/dropdown';
import { Input } from '@/components/input';
import { motion } from 'framer-motion';
import { CourseChip } from '../CourseChip';
import { EditableText } from './EditableText';
import { selectSectionById, updateSection } from '@/redux/slices/courses';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Section } from '@/types';
import { useAuth } from '@/contexts/auth';

const TIME_ITEMS = (['minutes', 'hours'] as const).map(t => ({ id: t, text: t }));

export const DraftSection: React.FC<{
    sectionId: string;
    draftId: string;
}> = ({ draftId, sectionId }) => {
    const { patch } = useAuth();

    const dispatch = useAppDispatch();
    const section = useAppSelector(state => selectSectionById(state, draftId, sectionId));
    if(!section) return null;

    const updateProperty = async (changes: Partial<Section>) => {
        if(!section) return;
        dispatch(updateSection({ courseId: draftId, sectionId, changes }));

        let hasChanges = false;
        for(const [property, value] of Object.entries(changes)) {
            if(section[property as keyof Section] !== value) {
                hasChanges = true;
            }
        }
        if(!hasChanges) return;

        patch<Section>(`/sections/${sectionId}`, changes)
            .catch(() => {
                if(!section) return;

                // Going back to previous state on error
                dispatch(updateSection({ courseId: draftId, sectionId, changes: section }))
            })
    }

    const { title, description, duration, durationIdentifier, xp } = section;
    return(
        <motion.div 
            className="flex-1 grid gap-4"
            exit={{ scale: .98, opacity: 0 }}
            initial={{ scale: .98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: .15 }}
        >
            <div className="p-4 flex gap-3 border-[1px] bg-secondary border-tertiary rounded-lg">
                <div className="flex">
                    <Input 
                        label={'Lecture duration'}
                        name={'lecture-duration'}
                        className='p-[10px] h-[38px] rounded-r-none'
                        containerClassName='w-[140px]'
                        onChange={duration => updateProperty({ duration: Number(duration) })}
                        value={!duration ? '' : duration}
                        type={'number'}
                    />
                    <Dropdown<typeof durationIdentifier> 
                        items={TIME_ITEMS}
                        active={durationIdentifier}
                        onSelect={durationIdentifier => updateProperty({ durationIdentifier })}
                        selectedClassName={'rounded-l-none'}
                        width={140}
                    />
                </div>
                <Input 
                    className='p-[10px] h-[38px]'
                    label={'Lecture XP'}
                    name={'lecture-xp'}
                    onChange={xp => updateProperty({ xp: Number(xp) })}
                    value={!xp ? '' : xp}
                    type={'number'}
                />
            </div>
            <div className="p-4 border-[1px] bg-secondary border-tertiary rounded-lg">
                <div className="flex items-center pb-4">
                    <CourseChip className={!duration ? 'italic' : ''}>
                        {duration ? `${duration} ${durationIdentifier}` : 'Lecture duration not set'}
                    </CourseChip>
                    <span className="px-1">
                        •
                    </span>
                    <CourseChip 
                        type={'xp'}
                        className={!xp ? 'italic': ''}
                    >
                        {xp ? `+${xp} XP` : 'Lecture XP not set'}
                    </CourseChip>
                </div>
                <EditableText 
                    className={`mb-1 text-xl ${title ? 'font-bold' : ''}`}
                    onChange={title => updateProperty({ title })}
                    text={title}
                    placeholder={'Lecture title not set'}
                />
                <EditableText 
                    className={`text-sm text-secondary`}
                    onChange={description => updateProperty({ description })}
                    text={description}
                    placeholder={'Lecture description not set'}
                />
            </div>
        </motion.div>
    )
}