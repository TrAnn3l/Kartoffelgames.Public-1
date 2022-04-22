import { Effect } from './effect';

export class PatternDevision {
    private mSampleIndex: number;
    private mPeriod: number;
    private mEffect: Effect; // Effect enum.
    private mEffectParameter: [number, number];
}