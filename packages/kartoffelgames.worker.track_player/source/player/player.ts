import { GenericModule } from '../generic_module/generic-module';
import { PlayerChannel } from './player-channel';
import { CursorChange } from './player-cursor';
import { PlayerGlobals } from './player-globals';

export class Player {
    private readonly mChannelList: Array<PlayerChannel>;
    private readonly mGlobals: PlayerGlobals;
    private readonly mModule: GenericModule;

    /**
     * Constructor.
     * @param pModule - Module tha should be played.
     * @param pChannelCount - Input channel count.
     * @param pSampleRate - Sample rate.
     */
    public constructor(pModule: GenericModule, pSampleRate: number) {
        this.mModule = pModule;
        this.mChannelList = new Array<PlayerChannel>();

        // Set globals.
        this.mGlobals = new PlayerGlobals(pModule, pSampleRate);
    }

    /**
     * Process next audio block.
     * @param pAudioBlockLength - Length of next audio block.
     */
    public next(pAudioBlockLength: number): Array<Float32Array> | null {
        // Exit if song is finished.
        if (this.mGlobals.cursor.songPosition >= this.mGlobals.lengthInformation.songPositions) {
            return null;
        }

        // Update channels.
        if (this.mChannelList.length > this.mModule.channelCount) {
            // Remove channels.
            this.mChannelList.splice(this.mModule.channelCount);
        } else if (this.mChannelList.length < this.mModule.channelCount) {
            // Create new channel for each missing.
            for (let lChannelIndex: number = this.mChannelList.length; lChannelIndex < this.mModule.channelCount; lChannelIndex++) {
                this.mChannelList.push(new PlayerChannel(this.mGlobals, lChannelIndex));
            }
        }

        // Create output buffer with specified length.
        const lOutputBufferList: Array<Float32Array> = new Array<Float32Array>();
        for (let lOutputIndex: number = 0; lOutputIndex < this.mModule.channelCount; lOutputIndex++) {
            lOutputBufferList.push(new Float32Array(pAudioBlockLength));
        }

        // For each audio sample.
        for (let lAudioSampleIndex: number = 0; lAudioSampleIndex < pAudioBlockLength; lAudioSampleIndex++) {
            // Tick next. Exit if no other pattern can be played.
            if (!this.tick()) {
                return lOutputBufferList;
            }

            // For each channel.
            for (let lChannelIndex = 0; lChannelIndex < this.mModule.channelCount; lChannelIndex++) {
                // Get next channel value.
                const lChannelBuffer = lOutputBufferList[lChannelIndex];
                lChannelBuffer[lAudioSampleIndex] = this.mChannelList[lChannelIndex].nextSample();
            }
        }

        return lOutputBufferList;
    }

    /**
     * Executes after each audio sample.
     * Triggers channels next division.
     * returns 
     */
    private tick(): boolean {
        // Move cursor one sample
        const lChangeOn: CursorChange = this.mGlobals.cursor.next();

        // TODO: Check for jump action.

        // Check song end.
        if (this.mGlobals.cursor.songPosition >= this.mGlobals.lengthInformation.songPositions) {
            return false;
        }

        // Call next division for each channel on new division.
        if (lChangeOn.songPosition) {
            for (const lChannel of this.mChannelList) {
                lChannel.nextPattern();
            }
        }

        // Call next division for each channel on new division.
        if (lChangeOn.division) {
            for (const lChannel of this.mChannelList) {
                lChannel.nextDivision();
            }
        }

        // Call next tick for each channel on new tick
        if (lChangeOn.tick) {
            // Call next tick for each channel.
            for (const lChannel of this.mChannelList) {
                lChannel.nextTick();
            }
        }

        return true;
    }
}