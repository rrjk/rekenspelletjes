/* BitReader and BitWriter belong so close together and are so small to it's decided to keep them in the same file */
/* eslint-disable max-classes-per-file */

/**
 * Writes a sequence of bits and serializes them as a URL-safe Base64 string.
 *
 * This helper is useful for compactly storing small binary payloads in URLs,
 * such as encoded game state or configuration flags.
 */
export class BitWriter {
  private bits: number[] = [];

  /**
   * Appends a numeric value using the given number of bits.
   *
   * The bits are written in big-endian order, with the most significant bit first.
   *
   * @param value - The integer value to encode.
   * @param numBits - The number of bits to write.
   */
  write(value: number, numBits: number) {
    for (let i = numBits - 1; i >= 0; i--) {
      this.bits.push((value >> i) & 1);
    }
  }

  /**
   * Converts the stored bit stream into a URL-safe Base64 representation.
   *
   * The underlying bit array is padded to a full byte boundary before being
   * converted to bytes and encoded using Base64URL encoding.
   *
   * @returns A Base64URL-encoded string without trailing '=' padding.
   */
  toBase64Url(): string {
    const padded = [...this.bits];
    while (padded.length % 8 !== 0) padded.push(0);
    const bytes = new Uint8Array(padded.length / 8);
    for (let i = 0; i < bytes.length; i++) {
      let byte = 0;
      for (let b = 0; b < 8; b++) byte = (byte << 1) | padded[i * 8 + b];
      bytes[i] = byte;
    }
    let bin = '';
    bytes.forEach(b => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}

/**
 * Reads a bit stream from a URL-safe Base64 string.
 *
 * This class decodes the serialized bit payload and allows retrieving values
 * in a streaming, bit-oriented way.
 */
export class BitReader {
  private bits: number[] = [];
  private pos = 0;

  /**
   * Creates a reader from a Base64URL-encoded bit payload.
   *
   * @param base64url - Encoded bit stream produced by BitWriter.toBase64Url().
   */
  constructor(base64url: string) {
    const bin = atob(base64url.replace(/-/g, '+').replace(/_/g, '/'));
    for (let i = 0; i < bin.length; i++) {
      const byte = bin.charCodeAt(i);
      for (let b = 7; b >= 0; b--) this.bits.push((byte >> b) & 1);
    }
  }

  /**
   * Reads the next `numBits` bits as an integer value.
   *
   * Bits are read in big-endian order, left to right, from the current position.
   *
   * @param numBits - Number of bits to read.
   * @returns The decoded integer value.
   */
  read(numBits: number): number {
    let value = 0;
    for (let i = 0; i < numBits; i++) {
      value = (value << 1) | this.bits[this.pos];
      this.pos += 1;
    }
    return value;
  }

  /**
   * Checks whether at least `minBits` bits remain available to read.
   *
   * @param minBits - The minimum number of bits required.
   * @returns True when the requested bit count is still available.
   */
  hasMore(minBits: number): boolean {
    return this.pos + minBits <= this.bits.length;
  }
}
