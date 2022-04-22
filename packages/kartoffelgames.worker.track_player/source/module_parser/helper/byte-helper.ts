export class ByteHelper {
    /**
     * Convert byte to byte.
     * @param pByte - Byte
     * @param pSigned - If result should be signed.
     */
    public static byteToByte(pByte: number, pSigned: boolean = false): number {
        let lByte: number = pByte & 0xff;

        // Sign word.
        if (pSigned) {
            lByte = (lByte > 127) ? (lByte - 127) * -1 : lByte;
        }

        return lByte;
    }

    /**
     * Convert byte to thwo nibbles.
     * @param pByte - Unsigned byte.
     * @param pSigned - If result should be signed.
     */
    public static byteToNibble(pByte: number, pSigned: boolean = false): [number, number] {
        let lHighNibble: number = (pByte >> 4) & 0xf;
        let lLowNibble: number = pByte & 0xf;

        // Sign both nibbles.
        if (pSigned) {
            lHighNibble = (lHighNibble > 7) ? (lHighNibble - 7) * -1 : lHighNibble;
            lLowNibble = (lLowNibble > 7) ? (lLowNibble - 7) * -1 : lLowNibble;
        }

        return [lHighNibble, lLowNibble];
    }

    /**
     * Convert byte array to string.
     * @param pByteArray - Unsigned Byte array.
     */
    public static byteToString(pByteArray: Uint8Array): string {
        // Filter NULL-Bytes.
        const lNullFilteredArray: Uint8Array = pByteArray.filter((pByte: number) => { return pByte !== 0; });

        // Decode byte array to string.
        return String.fromCharCode(...lNullFilteredArray);
    }

    /**
     * Convert two bytes to a world.
     * @param pHightByte - World unsigned hight byte.
     * @param pLowByte - World unsigned low byte.
     * @param pSigned - If result should be signed.
     */
    public static byteToWorld(pHightByte: number, pLowByte: number, pSigned: boolean = false): number {
        let lWord: number = ((pHightByte << 8) + pLowByte) & 0xffff;

        // Sign word.
        if (pSigned) {
            lWord = (lWord > 32767) ? (lWord - 32767) * -1 : lWord;
        }

        return lWord;
    }

    /**
     * Read part of byte array.
     * @param pData - Byte array.
     * @param pOffset - Offset.
     * @param pLength - Length of result.
     */
    public static readBytes(pData: Uint8Array, pOffset: number, pLength: number): Uint8Array {
        return pData.slice(pOffset, pOffset + pLength);
    }
}