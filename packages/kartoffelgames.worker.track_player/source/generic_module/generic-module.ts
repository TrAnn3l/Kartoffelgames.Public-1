import { PatternList } from './pattern/pattern-list';
import { SampleList } from './sample/sample-list';

export class GenericModule {
    private mChannelCount: number;
    private readonly mPattern: PatternList;
    private readonly mSamples: SampleList;
    private mSongName: string;

    /**
     * Get module channel count.
     */
    public get channelCount(): number {
        return this.mChannelCount;
    }

    /**
     * set module channel count.
     */
    public set channelCount(pCount: number) {
        this.mChannelCount = pCount;
    }

    /**
     * Get module pattern list.
     */
    public get pattern(): PatternList {
        return this.mPattern;
    }

    /**
     * Get samples.
     */
    public get samples(): SampleList {
        return this.mSamples;
    }

    /**
     * Get module song name.
     */
    public get songName(): string {
        return this.mSongName;
    }

    /**
     * set module song name.
     */
    public set songName(pName: string) {
        this.mSongName = pName;
    }

    /**
     * Constructor.
     * Initialize
     */
    public constructor() {
        this.mPattern = new PatternList();
        this.mSamples = new SampleList();
    }
}