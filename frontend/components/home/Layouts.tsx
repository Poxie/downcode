"use client";
import { ResultsIcon } from '@/assets/icons/ResultsIcon';
import { SandboxIcon } from '@/assets/icons/SandboxIcon';
import { VideoIcon } from '@/assets/icons/VideoIcon';
import { useState } from 'react';

const layouts = [
    { id: 'sandbox', text: 'With sandbox', icon: <SandboxIcon className="w-7" /> },
    { id: 'video', text: 'Just video', icon: <VideoIcon className="w-7" /> },
    { id: 'results', text: 'With results', icon: <ResultsIcon className="w-7" /> },
];

export const Layouts = () => {
    const [activeLayout, setActiveLayout] = useState(layouts[0].id);

    return(
        <section className="py-section max-w-main m-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center">
                An environment designed for learning.
            </h2>
            <p className="text-md sm:text-lg text-center text-secondary pt-4">
                Choose between multiple layouts for increased learnability. Test a few of them to find what works best for you.
            </p>
            
            <ul className="flex justify-center pt-8 gap-3">
                {layouts.map(layout => {
                    const active = layout.id === activeLayout;
                    return(
                        <li 
                            className="w-full sm:w-auto"
                            key={layout.id}
                        >
                            <button 
                                className={`grid place-items-center gap-4 py-6 w-full sm:w-[175px] h-full text-xs border-[1px] border-tertiary hover:bg-tertiary hover:text-primary ${active ? 'bg-tertiary text-primary' : 'bg-transparent text-secondary'} transition-colors rounded`}
                                onClick={() => setActiveLayout(layout.id)}
                            >
                                {layout.icon}
                                {layout.text}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}