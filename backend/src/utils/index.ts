import { getCourse } from "../routes/courses";
import { getUser } from "../routes/users";

// Function to create id
const ID_LENGTH = 10;
export const createId = async (table: 'user' | 'course') => {
    const opts = '0123456789';

    // Creating random id
    let id = ''
    for(let i = 0; i < ID_LENGTH; i++) {
        id += opts[Math.ceil(Math.random() * opts.length) - 1]
    }

    // Checking if id is available
    if(table === 'user' ? await getUser(id) : await getCourse(id)) {
        return await createId(table);
    }

    return id;
}