export type User = {
    id: string;
    username: string;
    displayName: string | null;
    avatar: string;
    isStaff: boolean;
    isSelf: boolean;
    createdAt: string;
}