// Auth constants
export const SALT_ROUNDS = 10;

// User login constants
export const MINIMUM_USERNAME_LENGTH = 2;
export const MAXIMUM_USERNAME_LENGTH = 20;
export const MINIMUM_PASSWORD_LENGTH = 4;
export const MAXIMUM_PASSWORD_LENGTH = 32;

export const ALLOWED_USER_UPDATE_PROPS = ['username',  'displayName', 'avatar'];
export const ALLOWED_FILE_EXTENSIONS = ['image/png', 'image/jpg', 'image/jpeg'];
export const ALLOWED_COURSE_UPDATE_PROPS = ['title',  'description', 'skillLevel'];
export const ALLOWED_SECTION_UPDATE_PROPS = ['title', 'description', 'duration', 'durationIdentifier', 'xp'];
export const ALLOWED_COURSE_TYPES = ['course', 'draft'];