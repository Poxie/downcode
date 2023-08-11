import { Dropdown } from '@/components/dropdown';
import { Input } from '@/components/input';
import { motion } from 'framer-motion';
import { CourseChip } from '../CourseChip';
import { EditableText } from './EditableText';

const TIME_ITEMS = (['minutes', 'hours'] as const).map(t => ({ id: t, text: t }));

export const DraftSection: React.FC<{
    sectionIndex: number;
}> = ({ sectionIndex }) => {
    return(
        <motion.div 
            className="flex-1 grid gap-4"
            exit={{ scale: .98, opacity: 0 }}
            initial={{ scale: .98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: .15 }}
        >
            {/* <div className="p-4 flex gap-3 border-[1px] bg-secondary border-tertiary rounded-lg">
                <div className="flex">
                    <Input 
                        label={'Lecture duration'}
                        name={'lecture-duration'}
                        className='p-[10px] h-[38px] rounded-r-none'
                        containerClassName='w-[140px]'
                        onChange={amount => {
                            updateSection(sectionIndex, 'duration', {
                                amount: Number(amount),
                                identifier: currentIdentifier,
                            })
                        }}
                        value={!currentAmount ? '' : currentAmount}
                        type={'number'}
                    />
                    <Dropdown<typeof currentIdentifier> 
                        items={TIME_ITEMS}
                        active={currentIdentifier}
                        onSelect={identifier => {
                            updateSection(sectionIndex, 'duration', {
                                amount: currentAmount,
                                identifier,
                            })
                        }}
                        selectedClassName={'rounded-l-none'}
                        width={140}
                    />
                </div>
                <Input 
                    className='p-[10px] h-[38px]'
                    label={'Lecture XP'}
                    name={'lecture-xp'}
                    onChange={xp => updateSection(sectionIndex, 'xp', Number(xp))}
                    value={!xp ? '' : xp}
                    type={'number'}
                />
            </div>
            <div className="p-4 border-[1px] bg-secondary border-tertiary rounded-lg">
                <div className="flex items-center pb-4">
                    <CourseChip className={!currentAmount ? 'italic' : ''}>
                        {currentAmount ? `${currentAmount} ${currentIdentifier}` : 'Lecture duration not set'}
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
                    onChange={text => updateSection(sectionIndex, 'title', text)}
                    text={title}
                    placeholder={'Lecture title not set'}
                />
                <EditableText 
                    className={`text-sm text-secondary`}
                    onChange={text => updateSection(sectionIndex, 'description', text)}
                    text={description}
                    placeholder={'Lecture description not set'}
                />
            </div> */}
        </motion.div>
    )
}