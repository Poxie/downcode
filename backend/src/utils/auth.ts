import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

// Function to get userId from auth headers
export const getUserIdFromHeaders: ((headers: Request['headers']) => Promise<string | null>) = async (headers) => {
    const accessToken = headers.authorization?.split(' ')[1];

    return new Promise((res, rej) => {
        jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY, async (error, decoded?: { 
            userId: string 
        }) => {
            if(error || !decoded) return res(null);
            res(decoded.userId);
        })
    })
}