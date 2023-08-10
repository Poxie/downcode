export const getUserAvatar = (avatarId: string) => (
    `${process.env.NEXT_PUBLIC_CDN_ORIGIN}/avatar/${avatarId}`
)