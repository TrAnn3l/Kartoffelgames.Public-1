import { GenericModule } from '../generic_module/generic-module';
import { PlayerChannel } from './player-channel';
import { CursorChange, CursorHandler } from './player_module/handler/cursor-handler';
import { JumpHandler } from './player_module/handler/jump-handler';
import { LengthHandler } from './player_module/handler/length-handler';
import { SpeedHandler } from './player_module/handler/speed-handler';
import { PlayerModule } from './player_module/player-module';

export class Player {
    private readonly mChannelList: Array<PlayerChannel>;
    private readonly mPlayerModule: PlayerModule;

    /**
     * Constructor.
     * @param pModule - Module tha should be played.
     * @param pChannelCount - Input channel count.
     * @param pSampleRate - Sample rate.
     */
    public constructor(pModule: GenericModule, pSampleRate: number) {
        this.mChannelList = new Array<PlayerChannel>();

        // Create handler.
        const lSpeedHandler: SpeedHandler = new SpeedHandler(pSampleRate);
        const lLengthHandler: LengthHandler = new LengthHandler(pModule, lSpeedHandler);
        const lCursorHandler: CursorHandler = new CursorHandler(lLengthHandler);
        const lJumpHandler: JumpHandler = new JumpHandler(lCursorHandler);

        // Create player module. Initialize with handler.
        this.mPlayerModule = new PlayerModule({
            genericModule: pModule,
            speedHandler: lSpeedHandler,
            lengthHandler: lLengthHandler,
            cursorHandler: lCursorHandler,
            jumpHandler: lJumpHandler
        });
    }

    /**
     * Process next audio block.
     * @param pAudioBlockLength - Length of next audio block.
     */
    public next(pAudioBlockLength: number): Array<Float32Array> | null {
        // Exit if song is finished.
        if (this.mPlayerModule.cursor.songPositionIndex >= this.mPlayerModule.length.songPositions) {
            return null;
        }

        // Update channels.
        if (this.mChannelList.length > this.mPlayerModule.length.channels) {
            // Remove channels.
            this.mChannelList.splice(this.mPlayerModule.length.channels);
        } else if (this.mChannelList.length < this.mPlayerModule.length.channels) {
            // Create new channel for each missing.
            for (let lChannelIndex: number = this.mChannelList.length; lChannelIndex < this.mPlayerModule.length.channels; lChannelIndex++) {
                this.mChannelList.push(new PlayerChannel(this.mPlayerModule, lChannelIndex));
            }
        }

        // Create output buffer with specified length.
        const lOutputBufferList: Array<Float32Array> = new Array<Float32Array>();
        for (let lOutputIndex: number = 0; lOutputIndex < this.mPlayerModule.length.channels; lOutputIndex++) {
            lOutputBufferList.push(new Float32Array(pAudioBlockLength));
        }

        // For each audio sample.
        for (let lAudioSampleIndex: number = 0; lAudioSampleIndex < pAudioBlockLength; lAudioSampleIndex++) {
            // Tick next. Exit if no other pattern can be played.
            const lCursorChange: CursorChange = this.tick();
            if (!lCursorChange) {
                return lOutputBufferList;
            }

            // For each channel.
            for (let lChannelIndex = 0; lChannelIndex < this.mPlayerModule.length.channels; lChannelIndex++) {
                // Get next channel value.
                const lChannelBuffer = lOutputBufferList[lChannelIndex];
                lChannelBuffer[lAudioSampleIndex] = this.mChannelList[lChannelIndex].nextSample(lCursorChange.songPosition, lCursorChange.division, lCursorChange.tick);
            }
        }

        return lOutputBufferList;
    }

    /**
     * Executes after each audio sample.
     * Triggers channels next division.
     */
    private tick(): CursorChange | null {
        // TODO: Execute pattern offset.

        // Move cursor one sample
        const lChangeOn: CursorChange = this.mPlayerModule.cursor.next();

        // Check for jump action. Jump only on division change.
        if (lChangeOn.division) {
            // Execute jump. Set everything on change state if jump happened.
            if (this.mPlayerModule.jump.executeJump()) {
                lChangeOn.division = true;
                lChangeOn.songPosition = true;
                lChangeOn.tick = true;
            } else if (this.mPlayerModule.jump.executeLoop()) {
                lChangeOn.division = true;
                lChangeOn.songPosition = false;
                lChangeOn.tick = true;
            }
        }

        // Check song end.
        if (this.mPlayerModule.cursor.songPositionIndex >= this.mPlayerModule.length.songPositions) {
            return null;
        }

        return lChangeOn;
    }
}