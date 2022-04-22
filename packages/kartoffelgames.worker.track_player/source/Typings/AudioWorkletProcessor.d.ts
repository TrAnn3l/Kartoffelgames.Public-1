/* eslint-disable @typescript-eslint/naming-convention */

interface AudioWorkletProcessor {
    readonly port: MessagePort;
    process(
        inputs: Array<Array<Float32Array>>,
        outputs: Array<Array<Float32Array>>,
        parameters: Record<string, Float32Array>
    ): boolean;
}

declare const AudioWorkletProcessor: {
    prototype: AudioWorkletProcessor;
    new(options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare interface AudioParamDescriptor {
    name: string,
    defaultValue: number,
    minValue: number,
    maxValue: number,
    automationRate?: string;
}

declare function registerProcessor(
    name: string,
    processorCtor: (new (
        options?: AudioWorkletNodeOptions
    ) => AudioWorkletProcessor) & {
        parameterDescriptors?: Array<AudioParamDescriptor>;
    }
): any;