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
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    type: 'draft' | 'course';
    status: 'idle' | 'pending' | 'published';
    createdAt: number;
    publishedAt: number | null;
}