import { GenericModule } from '../generic_module/generic-module';
import { PlayerChannel } from './player-channel';
import { PlayerGlobals } from './player-globals';

export class Player {
    private readonly mChannelList: Array<PlayerChannel>;
    private readonly mGlobals: PlayerGlobals;
    private readonly mModule: GenericModule;
    private readonly mTickCounter: TickCounter;

    /**
     * Constructor.
     * @param pModule - Module tha should be played.
     * @param pChannelCount - Input channel count.
     * @param pSampleRate - Sample rate.
     */
    public constructor(pModule: GenericModule, pSampleRate: number) {
        this.mModule = pModule;
        this.mChannelList = new Array<PlayerChannel>();

        // Setup tick counter.
        this.mTickCounter = {
            sampleCounter: 0,
            tickCounter: 0,
            songFinished: false
        };

        // Set globals.
        this.mGlobals = new PlayerGlobals(pSampleRate);
        this.mGlobals.beatsPerMinute = 125;
        this.mGlobals.ticksPerDivision = 6;
        this.mGlobals.speedUp = 1;
    }

    /**
     * Process next audio block.
     * @param pAudioBlockLength - Length of next audio block.
     */
    public next(pAudioBlockLength: number): Array<Float32Array> | null {
        // Exit if song is finished.
        if (this.mTickCounter.songFinished) {
            return null;
        }

        // Update channels.
        if (this.mChannelList.length > this.mModule.channelCount) {
            // Remove channels.
            this.mChannelList.splice(this.mModule.channelCount);
        } else if (this.mChannelList.length < this.mModule.channelCount) {
            // Create new channel for each missing.
            for (let lChannelIndex: number = this.mChannelList.length; lChannelIndex < this.mModule.channelCount; lChannelIndex++) {
                this.mChannelList.push(new PlayerChannel(this.mModule, this.mGlobals, lChannelIndex));
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
                this.mTickCounter.songFinished = true;
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
        // TODO: Set current tick, division and songposition  as global, so that new channels get these informations.


        // divisions/minute = 24 * BeatsPerMinute / TicksPerDivision
        // SamplesPerMinute / BeatsPerMinute
        const lSamplesPerTick = ((this.mGlobals.sampleRate * 60) / (this.mGlobals.beatsPerMinute * this.mGlobals.speedUp)) / 24;

        this.mTickCounter.sampleCounter++;

        // Check for next tick.
        let lPlaying: boolean = true;
        if (this.mTickCounter.sampleCounter >= lSamplesPerTick) {
            // Reset sample count and increment tick.
            this.mTickCounter.sampleCounter = 0;
            this.mTickCounter.tickCounter++;

            // Call next tick for each channel.
            for (const lChannel of this.mChannelList) {
                lChannel.nextTick();
            }

            // Check for next division.
            if (this.mTickCounter.tickCounter >= this.mGlobals.ticksPerDivision) {
                this.mTickCounter.tickCounter = 0;

                // Call next division for each channel.
                for (const lChannel of this.mChannelList) {
                    if (!lChannel.nextDivision()) {
                        lPlaying = false;
                    }
                }
            }
        }

        return lPlaying;
    }
}

interface TickCounter {
    sampleCounter: number;
    tickCounter: number;
    songFinished: boolean;
}