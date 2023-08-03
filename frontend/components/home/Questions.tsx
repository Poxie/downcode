import React from 'react';
import tailwindConfig from '@/tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig'
import { SendIcon } from '@/assets/icons/SendIcon';
import { WaveIcon } from '@/assets/icons/WaveIcon';

const fullConfig = resolveConfig(tailwindConfig);
const backgrounds = fullConfig.theme?.backgroundColor;

const ITEMS = [
    { title: 'Lecture comments', description: 'Ask or answer others\' questions.', extra: (
        Array.from(Array(2)).map((_, key) => (
            <div className="flex gap-2 mt-3 first-of-type:mt-4" key={key}>
                <div className="w-8 h-8 rounded-full bg-quaternary" />
                <div>
                    <div className="w-16 h-3.5 bg-quaternary rounded" />
                    <div className="flex gap-1 pt-1">
                        <div className="bg-quaternary h-3.5 w-[24px] rounded" />
                        <div className="bg-quaternary h-3.5 w-[31px] rounded" />
                        <div className="bg-quaternary h-3.5 w-[44px] rounded" />
                        <div className="bg-quaternary h-3.5 w-[33px] rounded" />
                    </div>
                </div>
            </div>
        ))
    ) },
    { title: 'Private questions', description: 'Only visible to you. We will answer as soon as possible.', extra: (
        <div className="flex justify-between bg-quaternary rounded-md mt-4 md:mt-auto p-2.5">
            <span className="text-xs text-secondary">
                Send a private question
            </span>
            <SendIcon className="w-4 text-secondary" />
        </div>
    ) },
    { title: 'Live questions', description: 'If you’re currently in the learning mood, send us a live question and we will answer within minutes.', extra: (
        <div className="flex justify-between bg-quaternary rounded-md mt-4 md:mt-auto p-2.5">
            <span className="text-xs text-secondary">
                Send a live question
            </span>
            <SendIcon className="w-4 text-secondary" />
        </div>
    ) },
]

export const Questions = () => {
    return(
        <section className="bg-secondary py-section relative">
            <WaveIcon 
                fill={backgrounds?.secondary as string}
                className="absolute bottom-full"
            />

            <h2 className="text-4xl text-center font-extrabold max-w-main m-auto">
                An environment meant for questions.
            </h2>
            <p className="text-lg text-secondary text-center mt-4 mb-8 w-[900px] max-w-main mx-auto">
                Questions will always appear while learning to code. View others’ questions and answers, or contact us directly if your question is still unanswered.
            </p>
            <ul className="flex flex-col md:flex-row gap-8 w-main max-w-main m-auto">
                {ITEMS.map((item, key) => (
                    <React.Fragment key={item.title}>
                        {key !== 0 && (
                            <div className="relative before:-top-3 before:left-[50%] before:-translate-x-[50%] before:rotate-90 md:before:rotate-0 md:before:top-[50%] md:before:-translate-y-[50%] md:before:-left-[18px] md:before:translate-x-0 before:w-[14px] before:h-[4px] before:bg-quaternary before:block before:absolute before:rounded after:top-3 after:left-[50%] after:-translate-x-[50%] after:rotate-90 md:after:rotate-0 md:after:top-[50%] md:after:-translate-y-[50%] md:after:left-[4px] md:after:translate-x-0 after:w-[14px] after:h-[4px] after:bg-quaternary after:block after:absolute after:rounded" />
                        )}
                        <li className="flex flex-col w-full sm:w-[350px] m-auto md:m-[unset] md:w-[unset] md:flex-1 flex-grow">
                            <div className="flex gap-[7px] border-[1px] bg-tertiary border-quaternary p-4 rounded-t-xl">
                                <div className="w-3 h-3 bg-[#C15344] rounded-full" />
                                <div className="w-3 h-3 bg-[#BFC144] rounded-full" />
                                <div className="w-3 h-3 bg-[#5DC144] rounded-full" />
                            </div>
                            <div className="p-4 flex flex-col flex-grow bg-tertiary border-[1px] border-t-0 border-quaternary rounded-b-xl">
                                <span className="text-sm font-semibold">
                                    {item.title}
                                </span>
                                <span className="text-sm text-secondary mt-[2px]">
                                    {item.description}
                                </span>
                                {item.extra}
                            </div>
                        </li>
                    </React.Fragment>
                ))}
            </ul>

            <WaveIcon 
                fill={backgrounds?.secondary as string}
                className="absolute top-full rotate-180"
            />
        </section>
    )
}