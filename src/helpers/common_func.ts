import { Buffer } from 'buffer';

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