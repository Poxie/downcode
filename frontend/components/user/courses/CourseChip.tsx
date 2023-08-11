type ChipType = 'neutral' | 'xp' | 'completed';

const getBackgroundFromType = (type: ChipType) => {
    if(type === 'neutral') return 'bg-quaternary';
    if(type === 'completed') return 'bg-completed';
    if(type === 'xp') return 'bg-gradient-to-r from-[#400090] to-[#5100B8]';
}

export const CourseChip: React.FC<{
    children: React.ReactNode;
    className?: string;
    type?: ChipType;
}> = ({ type='neutral', className='', children }) => {
    return(
        <div className={`px-[7px] py-[5px] rounded-md text-[10px] font-semibold ${getBackgroundFromType(type)} ` + className}>
            {children}
        </div>
    )
}