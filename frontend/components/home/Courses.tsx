"use client";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from "react"
import courses from '@/assets/json/Courses.json';
import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { ClockIcon } from "@/assets/icons/ClockIcon";

const courseTypes = ['beginner', 'intermediate', 'pro'] as const;

export const Courses = () => {
    const [activeType, setActiveType] = useState<typeof courseTypes[number]>(courseTypes[0]);
    const [disabled, setDisabled] = useState(false);

    return(
        <section>
            <div className="pt-8 border-t-[1px] border-t-secondary">
                <div className="w-main max-w-main m-auto">
                    <h2 className="text-4xl font-bold">
                        <span className="text-c-primary">Beginner</span> and <span className="text-c-primary">advanced</span> friendly.
                    </h2>
                    <p className="text-md sm:text-lg text-secondary pt-5 w-[700px] max-w-full">
                        We have material for all skill levels. From crash courses to detailed deep-dives into advanced topics. Choose a skill level below and explore possibilities to extend your knowledge.
                    </p>
                    <ul className="flex gap-6 py-8">
                        {courseTypes.map(courseType => {
                            const active = courseType === activeType;

                            return(
                                <li key={courseType}>
                                    <button 
                                        className={`${!active ? 'text-secondary' : 'text-c-primary border-b-[1px] border-b-c-primary'} hover:text-c-primary text-sm font-semibold`}
                                        onClick={() => {
                                            setActiveType(courseType);
                                            setDisabled(true);
                                        }}
                                        disabled={disabled}
                                    >
                                        {courseType.slice(0,1).toUpperCase() + courseType.slice(1)}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="bg-secondary py-8">
                    <div className="w-main max-w-main m-auto">
                        <AnimatePresence 
                            onExitComplete={() => setDisabled(false)}
                            mode="wait"
                        >
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" key={activeType}>
                                {courses[activeType].map((course, key) => (
                                    <motion.li
                                        exit={{ opacity: 0, translateY: 20 }}
                                        initial={{ opacity: 0, translateY: 20 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        transition={{ duration: .4, delay: .15 * key }}
                                        className="p-5 bg-tertiary rounded-md"
                                        key={course.path}
                                    >
                                        <div className="flex items-center gap-2 text-xs mb-4 text-secondary">
                                            <ClockIcon className="w-4" />
                                            <span>
                                                {course.estimatedTime}
                                            </span>
                                        </div>
                                        <span className="text-xl font-extrabold">
                                            {course.title}
                                        </span>
                                        <p className="text-sm text-secondary mt-2">
                                            {course.description}
                                        </p>
                                        <div className="flex justify-end pt-5 mt-5 border-t-[1px] border-t-quaternary">
                                            <Link 
                                                className="text-xs font-semibold transition-colors text-secondary hover:text-primary hover:bg-quaternary px-3 py-2.5 -mr-3 -my-2.5 rounded-md"
                                                href={course.path}
                                            >
                                                Go to course
                                            </Link>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </AnimatePresence>
                        <div className="w-full flex justify-end mt-4">
                            <Link 
                                className="flex gap-2 whitespace-nowrap text-xs font-semibold transition-colors text-secondary hover:text-primary hover:bg-quaternary px-3 py-2.5 -my-2.5 rounded-md"
                                href={`/courses/${activeType}`}
                            >
                                View all courses
                                <ArrowIcon />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}