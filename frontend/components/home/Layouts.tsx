"use client";
import { ResultsIcon } from '@/assets/icons/ResultsIcon';
import { SandboxIcon } from '@/assets/icons/SandboxIcon';
import { VideoIcon } from '@/assets/icons/VideoIcon';
import { useState, useEffect, useRef } from 'react';
import { Editor } from '../editor';
import { Preview } from '../editor/Preview';

const layouts = [
    { id: 'sandbox', text: 'With sandbox', icon: <SandboxIcon className="w-7" /> },
    { id: 'video', text: 'Just video', icon: <VideoIcon className="w-7" /> },
    { id: 'results', text: 'With results', icon: <ResultsIcon className="w-7" /> },
] as const;
type LayoutType = 'sandbox' | 'video' | 'results';

const DEFAULT_CODE = {
    html: `<!-- Your html code -->
<p>
  Code along while watching.
</p>`,
    css: `/* Your css code */
body {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}`,
    javascript: `// Your javascript code`
}

export const Layouts = () => {
    const [activeLayout, setActiveLayout] = useState<LayoutType>(layouts[0].id);
    const [code, setCode] = useState(DEFAULT_CODE);

    return(
        <section className="py-section w-main max-w-main m-auto">
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

            <div className="pt-8 pb-9">
                <div className="flex gap-[7px] border-[1px] bg-secondary border-tertiary p-4 rounded-t-xl">
                    <div className="w-3 h-3 bg-[#C15344] rounded-full" />
                    <div className="w-3 h-3 bg-[#BFC144] rounded-full" />
                    <div className="w-3 h-3 bg-[#5DC144] rounded-full" />
                </div>
                <div className="flex flex-col md:flex-row min-h-[480px] bg-secondary border-[1px] border-t-0 border-tertiary rounded-b-xl">
                    <div className={`aspect-video md:w-[60%] mb-0 md:mb-4 ${activeLayout === 'video' ? 'mx-auto my-4' : 'm-4'} bg-tertiary rounded-md`} />
                    
                    {activeLayout !== 'video' && (
                        <div className="flex flex-col flex-1 border-l-[1px] border-tertiary p-4 overflow-hidden">
                            {activeLayout === 'sandbox' && (
                                <>
                                <Editor 
                                    onChange={(language, code) => setCode(prev => ({
                                        ...prev,
                                        [language]: code
                                    }))}
                                    defaultCode={code}
                                />
                                <span className="text-xs text-secondary font-semibold my-2">
                                    Preview
                                </span>
                                <Preview {...code} />
                                </>
                            )}
                            {activeLayout === 'results' && (
                                <>
                                <span className="text-xs text-secondary font-semibold mb-2">
                                    Lecture end results
                                </span>
                                <div className="flex gap-3">
                                    <div className="aspect-video bg-tertiary rounded-md w-44" />
                                    <div>
                                        <div className="h-6 w-[160px] bg-tertiary rounded-md mb-1" />
                                        <div className="flex gap-1">
                                            <div className="h-4 w-[70px] bg-tertiary rounded-md" />
                                            <div className="h-4 w-[40px] bg-tertiary rounded-md" />
                                        </div>
                                    </div>
                                </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}