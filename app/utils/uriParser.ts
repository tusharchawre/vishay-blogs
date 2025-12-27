/**
 * Encodes a blog title and postId into a URI-friendly string
 * @param title The blog title to encode
 * @param postId The post ID to encode
 * @returns A URI-friendly string combining the title and postId
 */
export function encodeBlogUri(title: string, postId: number): string {
  // First encode the title to handle special characters
  const encodedTitle = encodeURIComponent(title)
    // Replace encoded spaces with dashes
    .replace(/%20/g, '-')
    // Replace encoded colons with dashes
    .replace(/%3A/g, '-')
    // Replace encoded commas with dashes
    .replace(/%2C/g, '-')
    // Replace encoded periods with dashes
    .replace(/\./g, '-')
    // Replace multiple dashes with a single dash
    .replace(/-+/g, '-')
    // Remove leading and trailing dashes
    .replace(/^-+|-+$/g, '');

  return `${encodedTitle}-${postId}`;
}

/**
 * Decodes a URI-friendly string back into a blog title and postId
 * @param uri The URI string to decode
 * @returns An object containing the original title and postId
 */
export function decodeBlogUri(uri: string): { title: string; postId: number } {
  // Split the URI by the last dash to separate title and postId
  const lastDashIndex = uri.lastIndexOf('-');

  if (lastDashIndex === -1) {
    throw new Error('Invalid URI format');
  }

  // Get the encoded title part
  const encodedTitle = uri.substring(0, lastDashIndex);
  const postId = parseInt(uri.substring(lastDashIndex + 1), 10);

  if (isNaN(postId)) {
    throw new Error('Invalid post ID in URI');
  }

  // Decode the title back to its original form
  const title = decodeURIComponent(encodedTitle);

  return {
    title,
    postId,
  };
}
