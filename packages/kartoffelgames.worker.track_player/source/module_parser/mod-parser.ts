import { GenericModule } from '../generic_module/generic-module';
import { Pattern } from '../generic_module/pattern/pattern';
import { Division } from '../generic_module/pattern/division';
import { Sample } from '../generic_module/sample/sample';
import { BaseParser } from './base-parser';
import { ByteHelper } from './helper/byte-helper';
import { DivisionEffect, Effect } from '../generic_module/pattern/division_effect';

/**
 * MOD file parser.
 */
export class ModParser extends BaseParser {
    private static readonly NAME_BYTE_LENGTH: number = 20;
    private static readonly SAMPLE_HEADER_BYTE_LENGTH: number = 30;

    /**
     * Parse MOD file.
     */
    public parse(): GenericModule {
        const lModule: GenericModule = new GenericModule();

        // Read dynamic module values.
        const lExtensionName: ModuleExtension = this.getExtensionName();
        const lChannelCount: number = this.getChannelCount(lExtensionName);
        const lPatternCount: number = this.getPatternCount(lExtensionName);

        // Set core values.
        lModule.channelCount = lChannelCount;

        // Decode module parts.
        this.parseName(lModule);
        this.parseSample(lModule, lExtensionName, lChannelCount, lPatternCount);
        this.parsePattern(lModule, lExtensionName, lChannelCount, lPatternCount);

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
        const lPatternInformationLength = 130;

        // Get 4 character extension name. 
        //When the module has a extension than it has allways 31 samples.
        const lOffset = ModParser.NAME_BYTE_LENGTH + (31 * ModParser.SAMPLE_HEADER_BYTE_LENGTH) + lPatternInformationLength;
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
        const lSampleCount: number = pModuleExtension !== '' ? 31 : 15;

        // Get offset to pattern oder. Name + sample header + order length + "RestartPosition"
        const lOffset = ModParser.NAME_BYTE_LENGTH + (lSampleCount * ModParser.SAMPLE_HEADER_BYTE_LENGTH) + 1 + 1;

        // Get sample play order and find max value.
        const lModuleSongPositionBuffer = ByteHelper.readBytes(this.data, lOffset, 128);
        const lHighestPatternIndex: number = Math.max(...lModuleSongPositionBuffer);

        // Index to count.
        return lHighestPatternIndex + 1;
    }

    /**
     * Parse module name.
     * @param pModule - Generic module.
     */
    private parseName(pModule: GenericModule): void {
        const lStartingOffset: number = 0;

        // Get module name as byte array.
        const lNameBuffer = ByteHelper.readBytes(this.data, lStartingOffset, ModParser.NAME_BYTE_LENGTH);

        // Convert byte to string.
        pModule.songName = ByteHelper.byteToString(lNameBuffer);
    }

    /**
     * Parse Pattern data. 
     * @param pModule - Generic module.
     * @param pChannelCount - Channel count.
     * @param pPatternCount - Pattern count.
     */
    private parsePattern(pModule: GenericModule, pModuleExtension: ModuleExtension, pChannelCount: number, pPatternCount: number): void {
        // Get sample count.
        const lSampleCount: number = (pModuleExtension !== '') ? 31 : 15;

        // Get sample order length.
        const lSampleOrderLengthOffset = ModParser.NAME_BYTE_LENGTH + (lSampleCount * ModParser.SAMPLE_HEADER_BYTE_LENGTH);
        const lSampleOrderLengthBuffer = ByteHelper.readBytes(this.data, lSampleOrderLengthOffset, 1);
        const lSampleOrderLength: number = lSampleOrderLengthBuffer[0];

        // Get sample order.
        const lSampleOrderOffset = ModParser.NAME_BYTE_LENGTH + (lSampleCount * ModParser.SAMPLE_HEADER_BYTE_LENGTH) + 1 + 1;
        const lModuleSongPositionBuffer = ByteHelper.readBytes(this.data, lSampleOrderOffset, 128);
        pModule.pattern.songPositions = [...lModuleSongPositionBuffer.slice(0, lSampleOrderLength)];

        // Set starting offset of first pattern division.
        let lNextPatternDevisionPosition: number = ModParser.NAME_BYTE_LENGTH + (ModParser.SAMPLE_HEADER_BYTE_LENGTH * lSampleCount);
        lNextPatternDevisionPosition += 130 + ((lSampleCount === 31) ? 4 : 0);  // Pattern count, pattern order and module extension.

        // Create new pattern.
        for (let lPatternIndex: number = 0; lPatternIndex < pPatternCount; lPatternIndex++) {
            const lPattern: Pattern = new Pattern(pChannelCount, 64);

            // Fill each division row.
            for (let lRowIndex: number = 0; lRowIndex < 64; lRowIndex++) {
                const lRow: Array<Division> = new Array<Division>();

                // Create new pattern division for each channel.
                for (let lChannelIndex: number = 0; lChannelIndex < pChannelCount; lChannelIndex++) {
                    // Get 32bit and concat all bits into one number: wwww xxxxxxxxxxxx yyyy zzzzzzzzzzzz = Length 32bit. 
                    const lDevisionBuffer: Uint8Array = ByteHelper.readBytes(this.data, lNextPatternDevisionPosition, 4);
                    const lBufferNumber: bigint = ByteHelper.concatBytes(lDevisionBuffer);

                    // wwww yyyy (8 bits ) - sample number, not index.
                    const lSampleNumber: number = Number(ByteHelper.pickBits(lBufferNumber, 32, [0, 1, 2, 3, 16, 17, 18, 19]));

                    // xxxx xxxx xxxx (12 bits) - sample period
                    const lSamplePeriod: number = Number(ByteHelper.pickBits(lBufferNumber, 32, [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));

                    // zzzz zzzz zzzz (12 bits) - sample effect
                    const lSampleEffect: number = Number(ByteHelper.pickBits(lBufferNumber, 32, [20, 21, 22, 23]));
                    const lSampleEffectParameterX: number = Number(ByteHelper.pickBits(lBufferNumber, 32, [24, 25, 26, 27]));
                    const lSampleEffectParameterY: number = Number(ByteHelper.pickBits(lBufferNumber, 32, [28, 29, 30, 31]));

                    // Create division effect.
                    const lEffect: DivisionEffect = new DivisionEffect();
                    lEffect.effect = <Effect>lSampleEffect; // TODO: Create switch case with all variants.
                    lEffect.parameterX = lSampleEffectParameterX;
                    lEffect.parameterY = lSampleEffectParameterY;

                    // Create division.
                    const lDevision: Division = new Division();
                    lDevision.period = lSamplePeriod;
                    lDevision.sampleIndex = lSampleNumber - 1;
                    lDevision.effect = lEffect;

                    // Add division to row.
                    lRow.push(lDevision);

                    // Set next divison position.
                    lNextPatternDevisionPosition += 4;
                }

                // Set row to pattern.
                lPattern.setRow(lRow, lRowIndex);
            }

            pModule.pattern.addPattern(lPattern, lPatternIndex);
        }
    }

    /**
     * Parse sample headers.
     * @param pModule - Generic module.
     * @param pModuleExtension - Module extension name.
     * @param pChannelCount - Channel count.
     * @param pPatternCount - Pattern count.
     */
    private parseSample(pModule: GenericModule, pModuleExtension: ModuleExtension, pChannelCount: number, pPatternCount: number): void {
        const lStartingOffset: number = ModParser.NAME_BYTE_LENGTH; // Module name.

        // Check for 31 or 15 Samples
        const lSampleCount: number = (pModuleExtension !== '') ? 31 : 15;

        // Sample header offsets.
        const lSampleNameOffset: number = 0; // String
        const lSampleLengthOffset: number = 22; // Word
        const lSampleFinetuneOffset: number = 24; // Signed-Lower-Nibble -8..7
        const lSampleVolumeOffset: number = 25; // Byte: 0..64
        const lSampleRepeatOffsetOffset: number = 26; // Word
        const lSampleRepeatLengthOffset: number = 28; // Word

        // Calculate sample body data offset.
        let lDataOffset: number = ModParser.NAME_BYTE_LENGTH;
        lDataOffset += ModParser.SAMPLE_HEADER_BYTE_LENGTH * lSampleCount;
        lDataOffset += 130 + ((lSampleCount === 31) ? 4 : 0); // Pattern count, pattern order and module extension.
        lDataOffset += 64 * 4 * pChannelCount * pPatternCount; // Pattern data.

        // Parse each sample header.
        let lPreviousSampleBodyDataLength: number = 0;
        for (let lSampleIndex: number = 0; lSampleIndex < lSampleCount; lSampleIndex++) {
            const lSampleHeaderOffset = (lSampleIndex * ModParser.SAMPLE_HEADER_BYTE_LENGTH) + lStartingOffset;
            const lSample: Sample = new Sample();

            // Read sample name.
            const lSampleNameBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleNameOffset, 22);
            lSample.name = ByteHelper.byteToString(lSampleNameBuffer);

            // Read sample length and save for later use.
            const lSampleLengthBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleLengthOffset, 2);
            const lSampleLength = ByteHelper.byteToWorld(lSampleLengthBuffer[0], lSampleLengthBuffer[1]) * 2; // WorldLength to ByteLength

            // Read sample fine tune. Lowest four bits represent a signed nibble.
            const lSampleFinetuneBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleFinetuneOffset, 1);
            lSample.fineTune = ByteHelper.byteToNibble(lSampleFinetuneBuffer[0], true)[1];

            // Read sample volume.
            const lSampleVolumeBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleVolumeOffset, 1);
            lSample.volume = ByteHelper.byteToByte(lSampleVolumeBuffer[0]);

            // Read sample repeat offset.
            const lSampleRepeatOffsetBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleRepeatOffsetOffset, 2);
            let lSampleRepeatOffset: number = ByteHelper.byteToWorld(lSampleRepeatOffsetBuffer[0], lSampleRepeatOffsetBuffer[1]) * 2; // WorldLength to ByteLength
            lSampleRepeatOffset -= 2; // Remove repeat information in first word. 

            // Read sample repeat length.
            const lSampleRepeatLengthBuffer: Uint8Array = ByteHelper.readBytes(this.data, lSampleHeaderOffset + lSampleRepeatLengthOffset, 2);
            let lSampleRepeatLength: number = ByteHelper.byteToWorld(lSampleRepeatLengthBuffer[0], lSampleRepeatLengthBuffer[1]) * 2; // WorldLength to ByteLength
            lSampleRepeatLength -= 2; // Remove repeat information in first word. 

            // Set repeat information.
            lSample.setRepeatInformation(lSampleRepeatOffset, lSampleRepeatLength);

            // Read sample body data and convert to Uint16.
            const lSampleLengthWithoutRepeat: number = lSampleLength - 2;
            if (lSampleLengthWithoutRepeat > 0) {
                const lSampleBodyDataInt8Buffer: Uint8Array = ByteHelper.readBytes(this.data, lDataOffset + lPreviousSampleBodyDataLength, lSampleLengthWithoutRepeat);
                const lSampleBodyDataFloat32Buffer: Float32Array = new Float32Array(lSampleLengthWithoutRepeat);
                for (let lIndex: number = 0; lIndex < lSampleLengthWithoutRepeat; lIndex++) {
                    lSampleBodyDataFloat32Buffer[lIndex] = ByteHelper.byteToByte(lSampleBodyDataInt8Buffer[lIndex], true) / 128; // Range [-1 .. 1]
                }
                lSample.data = lSampleBodyDataFloat32Buffer;
            } else {
                lSample.data = new Float32Array(0);
            }

            // Count previous sample body data length.
            lPreviousSampleBodyDataLength += lSampleLength;

            // Append to module samples.
            pModule.samples.setSample(lSample, lSampleIndex);
        }
    }
}

type ModuleExtension = 'M.K.' | 'FLT4' | 'FLT8' | 'M!K!' | '6CHN' | '8CHN' | '';