export type User = {
    id: string;
    username: string;
    displayName: string | null;
    isStaff: boolean;
    isSelf: boolean;
    createdAt: string;
}