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
            lByte = (lByte > 127) ? (lByte - 0x100) : lByte;
        }

        return lByte;
    }

    /**
     * Convert byte to thwo nibbles.
     * @param pByte - Unsigned byte.
     * @param pSigned - If result should be signed.
     */
    public static byteToNibble(pByte: number, pSigned: boolean = false): [number, number] {
        let lHighNibble: number = (pByte >>> 4) & 0xf;
        let lLowNibble: number = pByte & 0xf;

        // Sign both nibbles.
        if (pSigned) {
            lHighNibble = (lHighNibble > 7) ? (lHighNibble - 0x10) : lHighNibble;
            lLowNibble = (lLowNibble > 7) ? (lLowNibble - 0x10) : lLowNibble;
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
            lWord = (lWord > 32767) ? (lWord - 0x10000) : lWord;
        }

        return lWord;
    }

    /**
     * Concat byte array to a single big int value.
     * @param pByteArray - Byte array.
     */
    public static concatBytes(pByteArray: Uint8Array): bigint {
        let lConcatNumber: bigint = null;

        // Extend bigint for each byte.
        for (const lByte of pByteArray) {
            if (lConcatNumber === null) {
                // Initialize bigInt with first byte.
                lConcatNumber = BigInt(lByte);
            } else {
                // Shift by 8 bit and append new byte.
                lConcatNumber <<= 8n;
                lConcatNumber += BigInt(lByte);
            }
        }

        return lConcatNumber;
    }

    /**
     * Pick bits and concat every picket bit into one number.
     * @param pBits - Bit to pick.
     * @param pBitList - index of bits.
     */
    public static pickBits(pBits: bigint, pBitLength: number, pBitList: Array<number>): bigint {
        let lPicketNumber: bigint = null;

        // Pick each bit.
        for (const lBitIndex of pBitList) {
            // Create bitmask with revered index. Convert pBitLength to last index.
            const lBitMask: bigint = BigInt(1 << (pBitLength - 1) - lBitIndex);

            // Apply bitmask and get single bit.
            const lPickedBit: bigint = ((pBits & lBitMask) !== 0n) ? 1n : 0n;

            if(lPicketNumber === null){
                lPicketNumber = lPickedBit;
            } else {
                lPicketNumber <<= 1n;
                lPicketNumber += lPickedBit;
            }
        }

        return lPicketNumber;
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