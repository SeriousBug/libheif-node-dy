/** Get the information about the heif file.
 *
 * This is done without decoding the image.
 */
export function getInfo(buffer: Buffer): {
  width: number;
  height: number;
  /** Only available if libheif version is 1.12.0 or later. */
  isPremultipliedAlpha?: boolean;
  hasAlphaChannel: boolean;
  lumaBitsPerPixel: number;
  chromaBitsPerPixel: number;
};

/** Decode the heif file.
 *
 * Returns a buffer of raw RGBA image data.
 */
export function decode(buffer: Buffer): Buffer;
