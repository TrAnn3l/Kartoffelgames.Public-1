import { Exception } from '@kartoffelgames/core.data';
import { DivisionChannel } from './division-channel';

export class Division {
    private readonly mChannelList: Array<DivisionChannel>;

    /**
     * Get channel count.
     */
    public get channelCount(): number {
        return this.mChannelList.length;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mChannelList = new Array<DivisionChannel>();
    }

    /**
     * Add channel data.
     * @param pIndex - Channel index.
     */
    public addChannel(pIndex: number): DivisionChannel {
        const lNewChannel: DivisionChannel = new DivisionChannel();

        // Add new when no index is specified.
        if (pIndex === null || pIndex === this.mChannelList.length) {
            this.mChannelList.push(lNewChannel);
        } else {
            // Check if index would produce gaps.
            if (pIndex > this.mChannelList.length) {
                throw new Exception(`Channel index would produce gaps with missing channels.`, this);
            }

            // Set channel to index.
            this.mChannelList[pIndex] = lNewChannel;
        }

        return lNewChannel;
    }

    /**
     * Get channel data.
     * @param pChannelIndex - Channel index.
     */
    public getChannel(pChannelIndex: number): DivisionChannel {
        return this.mChannelList[pChannelIndex] ?? new DivisionChannel();
    }

    /**
     * Remove sample by index.
     * @param pIndex - Index of sample.
     */
    public removeChannel(pIndex: number): void {
        // Exit if index is out of bound.
        if (pIndex >= (this.mChannelList.length - 1)) {
            return;
        }

        // Remove last element if index is last element.
        if (pIndex === (this.mChannelList.length - 1)) {
            this.mChannelList.pop();
        } else {
            // Replace with empty channel if any gap would be produced.
            this.mChannelList[pIndex] = new DivisionChannel();
        }
    }
}