import { GenericModule } from '../generic_module/generic-module';
import { ModParser } from '../module_parser/ModParser';

export class TrackPlayerProcessor extends AudioWorkletProcessor {
    private mModule: GenericModule;
    private readonly mSampleRate: number;

    /**
     * Constructor.
     * Set message port.
     */
    public constructor() {
        super();

        // Set module as unloaded.
        this.mModule = null;

        // Save globals.
        this.mSampleRate = sampleRate;

        // Set port listener for receiving messages.
        this.port.addEventListener('message', (pEvent: MessageEvent) => {
            if (typeof pEvent.data === 'object' && pEvent.data !== null) {
                // Read message type.
                const lType: string = pEvent.data?.type ?? null;

                // If message has valid type, load message data.
                if (lType !== null) {
                    const lData: MessageData = pEvent.data?.data ?? null;

                    // Process message when message data is valid.
                    if (lData !== null) {
                        this.readMessage(lType, lData);
                    }
                }
            }
        });
        this.port.start();
    }

    /**
     * Mix module to audio output.
     * @param pInputs - Input.
     * @param pOutputs - Output.
     * @param pParameters - Processor parameter.
     */
    public process(pInputs: Array<Array<Float32Array>>, pOutputs: Array<Array<Float32Array>>, pParameters: Record<string, Float32Array>): boolean {
        if (this.mModule !== null) {
            const lOutput = pOutputs[0];
            for (const lOutputChannel of lOutput) {
                for (let lIndex = 0; lIndex < lOutputChannel.length; ++lIndex) {
                    lOutputChannel[lIndex] = (Math.random() - 0.5);
                }
            }
        }

        return true;
    }

    /**
     * Load binary file and parse to a generic module.
     * @param pFile - File as binary data.
     */
    private loadFile(pType: string, pFile: ArrayBuffer): void {
        const lFile: Uint8Array = new Uint8Array(pFile);

        // Parse with correct data.
        switch (pType.toUpperCase()) {
            case 'MOD':
                this.mModule = new ModParser(lFile).parse();
        }

        console.log('SAMPLE-RATE', this.mSampleRate);
        console.log('MODULE', this.mModule);
    }

    /**
     * Process message.
     * @param pMessageType - Message type.
     * @param pMessageData - Message data.
     */
    private readMessage(pMessageType: string, pMessageData: MessageData): void {
        switch (pMessageType) {
            case 'load': this.loadFile(pMessageData.type, pMessageData.buffer);
        }
    }
}

type LoadMessageData = { buffer: ArrayBuffer, type: string; };
type MessageData = LoadMessageData;

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const sampleRate: number;

registerProcessor('Trackplayer', TrackPlayerProcessor);