import { GenericModule } from '../generic_module/generic-module';
import { Sample } from '../generic_module/sample/sample';
import { BaseParser } from './BaseParser';
import { ByteHelper } from './helper/byte-helper';

/**
 * MOD file parser.
 */
export class ModParser extends BaseParser {
    /**
     * Parse MOD file.
     */
    public parse(): GenericModule {
        const lModule: GenericModule = new GenericModule();

        // Read dynamic module values.
        const lExtensionName: ModuleExtension = this.getExtensionName();
        const lChannelCount: number = this.getChannelCount(lExtensionName);
        const lPatternCount: number = this.getPatternCount(lExtensionName);

        // Decode module parts.
        this.parseName(lModule);
        this.parseSample(lModule, lExtensionName, lChannelCount, lPatternCount);
        this.parsePattern(lModule, lChannelCount, lPatternCount);

        return lModule;
    }

    /**
     * Parse module name.
    * @param pModuleExtension - Module extension name.
     */
    private getChannelCount(pModuleExtension: ModuleExtension): number {
        switch (pModuleExtension) {
            case 'FLT8':
            case '8CHN':
                return 8;
            case '6CHN':
                return 6;
            default:
                return 4;
        }
    }

    /**
     * Parse extension name of module.
     */
    private getExtensionName(): ModuleExtension {
        const lModuleNameLength: number = 20; // Module name.
        const lSampleHeaderByteLength = 30;
        const lPatternInformationLength = 130;

        // Get 4 character extension name. 
        //When the module has a extension than it has allways 31 samples.
        const lOffset = lModuleNameLength + (31 * lSampleHeaderByteLength) + lPatternInformationLength;
        const lModuleExtensionBuffer = ByteHelper.readBytes(this.data, lOffset, 4);
        const lModuleExtensionName: string = ByteHelper.byteToString(lModuleExtensionBuffer);

        // Check for all possible extension names. Return empty if no one matches any of those.
        return <ModuleExtension>((['M.K.', 'FLT4', 'FLT8', 'M!K!', '6CHN', '8CHN'].includes(lModuleExtensionName)) ? lModuleExtensionName : '');
    }

    /**
     * Parse module name.
     * @param pModuleExtension - Module extension name.
     */
    private getPatternCount(pModuleExtension: ModuleExtension): number {
        const lModuleNameLength: number = 20; // Module name.
        const lSampleHeaderByteLength = 30;

        const lSampleCount: number = pModuleExtension !== '' ? 31 : 15;

        // Get offset to song positions
        const lOffset = lModuleNameLength + (lSampleCount * lSampleHeaderByteLength);
        const lModuleSongPositionBuffer = ByteHelper.readBytes(this.data, lOffset, 1);

        return ByteHelper.byteToByte(lModuleSongPositionBuffer[0]);
    }

    /**
     * Parse module name.
     * @param pModule - Generic module.
     */
    private parseName(pModule: GenericModule): void {
        const lStartingOffset: number = 0;

        // Get module name as byte array.
        const lNameBuffer = ByteHelper.readBytes(this.data, lStartingOffset, 20);

        // Convert byte to string.
        pModule.songName = ByteHelper.byteToString(lNameBuffer);
    }

    /**
     * Parse Pattern data. 
     * @param pModule - Generic module.
     * @param pChannelCount - Channel count.
     * @param pPatternCount - Pattern count.
     */
    private parsePattern(pModule: GenericModule, pChannelCount: number, pPatternCount: number): void {




    }

    /**
     * Parse sample headers.
     * @param pModule - Generic module.
     * @param pModuleExtension - Module extension name.
     * @param pChannelCount - Channel count.
     * @param pPatternCount - Pattern count.
     */
    private parseSample(pModule: GenericModule, pModuleExtension: ModuleExtension, pChannelCount: number, pPatternCount: number): void {
        const lStartingOffset: number = 20; // Module name.
        const lSampleHeaderByteLength = 30;

        // Check for 31 or 15 Samples
        const lSampleCount: number = (pModuleExtension !== '') ? 31 : 15;
        pModule.samples.sampleCount = lSampleCount;

        // Sample header offsets.
        const lSampleNameOffset: number = 0; // String
        const lSampleLengthOffset: number = 22; // Word
        const lSampleFinetuneOffset: number = 24; // Signed-Lower-Nibble -8..7
        const lSampleVolumeOffset: number = 25; // Byte: 0..64
        const lSampleRepeatOffsetOffset: number = 26; // Word
        const lSampleRepeatLengthOffset: number = 28; // Word

        // Calculate sample body data offset.
        let lDataOffset: number = 20; // Module name.
        lDataOffset += 30 * lSampleCount; // Sample header.
        lDataOffset += 130 + ((lSampleCount === 31) ? 4 : 0); // Pattern count, pattern order and module extension.
        lDataOffset += 256 * pChannelCount * pPatternCount; // Pattern data.

        // Parse each sample header.
        let lPreviousSampleBodyDataLength: number = 0;
        for (let lSampleIndex: number = 0; lSampleIndex < lSampleCount; lSampleIndex++) {
            const lSampleHeaderOffset = (lSampleIndex * lSampleHeaderByteLength) + lStartingOffset;
            const lSample: Sample = new Sample();

            // Read sample name.
            const lSampleNameBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleNameOffset, 22);
            lSample.name = ByteHelper.byteToString(lSampleNameBuffer);

            // Read sample length and save for later use.
            const lSampleLengthBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleLengthOffset, 2);
            const lSampleLength = ByteHelper.byteToWorld(lSampleLengthBuffer[0], lSampleLengthBuffer[1]);

            // Read sample fine tune. Lowest four bits represent a signed nibble.
            const lSampleFinetuneBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleFinetuneOffset, 1);
            lSample.fineTune = ByteHelper.byteToNibble(lSampleFinetuneBuffer[0], true)[1];

            // Read sample volume.
            const lSampleVolumeBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleVolumeOffset, 1);
            lSample.volume = ByteHelper.byteToByte(lSampleVolumeBuffer[0]);

            // Read sample repeat offset.
            const lSampleRepeatOffsetBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleRepeatOffsetOffset, 2);
            const lSampleRepeatOffset: number = ByteHelper.byteToWorld(lSampleRepeatOffsetBuffer[0], lSampleRepeatOffsetBuffer[1]);

            // Read sample repeat offset.
            const lSampleRepeatLengthBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleRepeatLengthOffset, 2);
            const lSampleRepeatLength: number = ByteHelper.byteToWorld(lSampleRepeatLengthBuffer[0], lSampleRepeatLengthBuffer[1]);

            // Set repeat information.
            lSample.setRepeatInformation(lSampleRepeatOffset, lSampleRepeatLength);

            // Read sample body data and convert to Uint16.
            const lSampleBodyDataInt8Buffer: Uint8Array = ByteHelper.readBytes(this.data, lDataOffset + lPreviousSampleBodyDataLength, lSampleLength);
            const lSampleBodyDataInt16Buffer: Int16Array = new Int16Array(lSampleLength);
            for (let lIndex: number = 0; lIndex < lSampleLength; lIndex++) {
                lSampleBodyDataInt16Buffer[lIndex] = ByteHelper.byteToByte(lSampleBodyDataInt8Buffer[lIndex], true);
            }
            lSample.data = lSampleBodyDataInt16Buffer;

            // Count previous sample body data length.
            lPreviousSampleBodyDataLength += lSampleLength;

            // Append to module samples.
            pModule.samples.setSample(lSampleIndex, lSample);
        }
    }
}

type ModuleExtension = 'M.K.' | 'FLT4' | 'FLT8' | 'M!K!' | '6CHN' | '8CHN' | '';