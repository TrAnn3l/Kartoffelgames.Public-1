abstract class AudioWorkletProcessorMock {
    public sampleRate: number = 48000;
}

const gRegisterProcessor = (pName: string, pProcessorCtor: any) => {
    // Nothing for now.
};

(<any>globalThis).AudioWorkletProcessor = AudioWorkletProcessorMock;
(<any>globalThis).registerProcessor = gRegisterProcessor;