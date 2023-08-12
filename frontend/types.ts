export type User = {
    id: string;
    username: string;
    displayName: string | null;
    avatar: string;
    isStaff: boolean;
    isSelf: boolean;
    createdAt: string;
}
export type Course = {
    id: string;
    title: string;
    description: string;
    author: User;
    sections: Section[];
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    type: 'draft' | 'course';
    status: 'idle' | 'pending' | 'published';
    createdAt: string;
    publishedAt: string | null;
}
export type Section = {
    id: string;
    courseId: string;
    duration: number;
    durationIdentifier: 'minutes' | 'hours';
    xp: number;
    title: string;
    description: string;
    createdAt: string;
}