import { Buffer } from 'buffer';
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { parse } from 'cookie';

// Function to convert base64 string to Blob and get its actual size
export const getFileSizeFromBase64 = (base64String: string): number => {
  // Remove the base64 header if present
  const base64Data = base64String.split(',')[1] || base64String;

  // Convert base64 string to a Buffer (binary data)
  const binaryData = Buffer.from(base64Data, 'base64');

  // Create a Blob-like object (Node.js doesn't support Blob, so use Buffer)
  const blob = new Blob([binaryData], { type: 'application/octet-stream' });

  // Return the Blob size (in bytes)
  return blob.size;
};

export async function getUserFromHeader(req: NextRequest): Promise<JwtPayload | null> {
    const cookies = parse(req.headers.get('cookie') || '');
    if (cookies.jwtAccessToken && cookies.jwtAccessToken.length > 0) {
        try {
            const secret = process.env.JWT_SECRET || '';
            return jwt.verify(cookies.jwtAccessToken, secret) as JwtPayload;
        } catch (err) {
            console.error('JWT verification failed:', err);
        }
    }
    return null;
}