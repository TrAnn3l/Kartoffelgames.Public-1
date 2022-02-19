import { expect } from 'chai';
import { InteractionDetectionProxy } from '../../../source/change_detection/synchron_tracker/interaction-detection-proxy';
import { ChangeDetection } from '../../../source/change_detection/change-detection';

describe('InteractionDetectionProxy', () => {
    describe('Static Method: getOriginal', () => {
        it('-- Proxy object', () => {
            // Setup.
            const lOriginalObject: object = { a: 1 };
            const lProxy: object = new InteractionDetectionProxy(lOriginalObject).proxy;

            // Process.
            const lObject: object = InteractionDetectionProxy.getOriginal(lProxy);

            // Evaluation.
            expect(lProxy).to.not.equal(lOriginalObject);
            expect(lObject).to.equal(lOriginalObject);
        });

        it('-- Original object', () => {
            // Setup.
            const lOriginalObject: object = { a: 1 };

            // Process.
            const lObject: object = InteractionDetectionProxy.getOriginal(lOriginalObject);

            // Evaluation.
            expect(lObject).to.equal(lOriginalObject);
        });

        it('-- Proxy Function', () => {
            // Setup.
            const lOriginalFunction: () => void = () => { return; };
            const lProxy: () => void = new InteractionDetectionProxy(lOriginalFunction).proxy;

            // Process.
            const lFunction: () => void = InteractionDetectionProxy.getOriginal(lProxy);

            // Evaluation.
            expect(lProxy).to.not.equal(lOriginalFunction);
            expect(lFunction).to.equal(lOriginalFunction);
        });

        it('-- Original with attached proxy', () => {
            // Setup.
            const lOriginalObject: object = { a: 1 };
            new InteractionDetectionProxy(lOriginalObject).proxy;

            // Process.
            const lObject: object = InteractionDetectionProxy.getOriginal(lOriginalObject);

            // Evaluation.
            expect(lObject).to.equal(lOriginalObject);
        });

        it('-- Original of NULL', () => {
            // Process.
            const lNull: null = InteractionDetectionProxy.getOriginal(null);

            // Evaluation.
            expect(lNull).to.be.null;
        });
    });

    it('Property: proxy', () => {
        // Setup.
        const lOriginalObject: object = { a: 1 };
        const lChangeDetection: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lOriginalObject);

        // Process.
        const lProxy: object = lChangeDetection.proxy;

        // Evaluation.
        expect(lProxy).to.not.equal(lOriginalObject);
    });

    it('Property: onChange', () => {
        // Setup.
        const lOnChangeFunction: () => void = () => { return; };
        const lChangeDetection: InteractionDetectionProxy<object> = new InteractionDetectionProxy({});

        // Process.
        lChangeDetection.onChange = lOnChangeFunction;
        const lFunctionResult = lChangeDetection.onChange;

        // Evaluation.
        expect(lFunctionResult).to.equal(lOnChangeFunction);
    });

    describe('Functionality: ChangeDetection', () => {
        it('-- Double initialization', () => {
            // Setup.
            const lOriginalObject: object = {};

            // Process. First Proxy
            const lFirstChangeDetection: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lOriginalObject);
            const lFirstProxy: object = lFirstChangeDetection.proxy;

            // Process. First Proxy
            const lSecondChangeDetection: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lFirstProxy);
            const lSecondProxy: object = lSecondChangeDetection.proxy;

            // Evaluation.
            expect(lFirstProxy).to.equal(lSecondProxy);
            expect(lFirstChangeDetection).to.equal(lSecondChangeDetection);
        });

        describe('-- SET', () => {
            it('-- Default', () => {
                // Setup.
                const lNewValue: number = 22;
                const lOriginalObject: { a: number; } = { a: 1 };
                const lChangeDetection: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                lChangeDetection.proxy.a = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a).to.equal(lNewValue);
            });

            it('-- Layered change', () => {
                // Setup.
                const lNewValue: number = 22;
                const lOriginalObject: { a: { b: number; }; } = { a: { b: 1 } };
                const lChangeDetection: InteractionDetectionProxy<{ a: { b: number; }; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                lChangeDetection.proxy.a.b = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a.b).to.equal(lNewValue);
            });

            it('-- Hook', () => {
                // Setup.
                const lOriginalObject: { a: number; } = { a: 1 };
                const lChangeDetection: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.onChange = (_pTargetObject: { a: number; }, pPropertyName: string) => {
                    if (pPropertyName === 'a') {
                        lPropertyChanged = true;
                    }
                };

                // Process.
                lChangeDetection.proxy.a = 22;

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });
        });

        describe('-- GET', () => {
            it('-- Primitive', () => {
                // Setup.
                const lValue: number = 22;
                const lOriginalObject: { a: number; } = { a: lValue };
                const lChangeDetection: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                const lResultValue: number = lChangeDetection.proxy.a;

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Object', () => {
                // Setup.
                const lValue: object = {};
                const lOriginalObject: { a: object; } = { a: lValue };
                const lChangeDetection: InteractionDetectionProxy<{ a: object; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                const lResultValue: object = lChangeDetection.proxy.a;

                // Evaluation.
                expect(lResultValue).to.not.equal(lValue);
                expect(InteractionDetectionProxy.getOriginal(lResultValue)).to.equal(lValue);
            });

            it('-- Function', () => {
                // Setup.
                const lValue: () => void = () => { return; };
                const lOriginalObject: { a: () => void; } = { a: lValue };
                const lChangeDetection: InteractionDetectionProxy<{ a: () => void; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                const lResultValue: () => void = lChangeDetection.proxy.a;

                // Evaluation.
                expect(lResultValue).to.not.equal(lValue);
                expect(InteractionDetectionProxy.getOriginal(lResultValue)).to.equal(lValue);
            });

            it('-- Layered change detection', () => {
                // Setup.
                const lOriginalObject: { a: { b: number; }; } = { a: { b: 1 } };
                const lChangeDetection: InteractionDetectionProxy<{ a: { b: number; }; }> = new InteractionDetectionProxy(lOriginalObject);

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.onChange = (_pTargetObject: { a: { b: number; }; }, pPropertyName: string) => {
                    if (pPropertyName === 'b') {
                        lPropertyChanged = true;
                    }
                };

                // Process.
                lChangeDetection.proxy.a.b = 22;

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });
        });

        describe('-- DELETE', () => {
            it('-- Default', () => {
                // Setup.
                const lOriginalObject: { a: number; } = { a: 1 };
                const lChangeDetection: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                delete lChangeDetection.proxy.a;

                // Evaluation.
                expect(lOriginalObject.a).to.be.undefined;
            });

            it('-- Hook', () => {
                // Setup.
                const lOriginalObject: { a: number; } = { a: 1 };
                const lChangeDetection: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.onChange = (_pTargetObject: { a: number; }, pPropertyName: string) => {
                    if (pPropertyName === 'a') {
                        lPropertyChanged = true;
                    }
                };

                // Process.
                delete lChangeDetection.proxy.a;

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });
        });

        describe('-- APPLY', () => {
            it('-- Sync call success', () => {
                // Setup.
                const lValue: number = 22;
                const lChangeDetection: InteractionDetectionProxy<(pValue: number) => number> = new InteractionDetectionProxy((pValue: number) => { return pValue; });
                const lProxy: (pValue: number) => number = lChangeDetection.proxy;

                // Process.
                const lResultValue: number = lProxy(lValue);

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Hook - Sync call success', () => {
                // Setup.
                const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
                const lChangeDetection: InteractionDetectionProxy<(pValue: number) => number> = new InteractionDetectionProxy(lFunction);
                const lProxy: (pValue: number) => number = lChangeDetection.proxy;

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.onChange = (_pTargetObject: { a: number; }, pPropertyName: any) => {
                    if (pPropertyName === lFunction) {
                        lPropertyChanged = true;
                    }
                };

                // Process
                lProxy(22);

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Sync call error', () => {
                // Setup.
                const lValue: number = 22;
                const lChangeDetection: InteractionDetectionProxy<() => number> = new InteractionDetectionProxy(() => { throw lValue; });
                const lProxy: () => number = lChangeDetection.proxy;

                // Process.
                let lResultValue: number;
                try {
                    lProxy();
                } catch (pError) {
                    lResultValue = pError;
                }

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Hook - Sync call error', () => {
                // Setup.
                const lFunction: () => number = () => { throw 22; };
                const lChangeDetection: InteractionDetectionProxy<() => number> = new InteractionDetectionProxy(lFunction);
                const lProxy: () => number = lChangeDetection.proxy;

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.onChange = (_pTargetObject: { a: number; }, pPropertyName: any) => {
                    if (pPropertyName === lFunction) {
                        lPropertyChanged = true;
                    }
                };

                // Process
                try {
                    lProxy();
                } catch (e) {/* Empty */ }

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Async call success', async () => {
                // Setup.
                const lValue: number = 22;
                const lChangeDetection: InteractionDetectionProxy<(pValue: number) => Promise<number>> = new InteractionDetectionProxy(async (pValue: number) => { return pValue; });
                const lProxy: (pValue: number) => Promise<number> = lChangeDetection.proxy;

                // Process.
                const lResultValue: number = await lProxy(lValue);

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Hook - async call success', async () => {
                // Setup.
                const lFunction: (pValue: number) => Promise<number> = async (pValue: number) => { return pValue; };
                const lChangeDetection: InteractionDetectionProxy<(pValue: number) => Promise<number>> = new InteractionDetectionProxy(lFunction);
                const lProxy: (pValue: number) => Promise<number> = lChangeDetection.proxy;

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.onChange = (_pTargetObject: { a: number; }, pPropertyName: any) => {
                    if (pPropertyName === lFunction) {
                        lPropertyChanged = true;
                    }
                };

                // Process
                await lProxy(22);

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Async call error', async () => {
                // Setup.
                const lValue: number = 22;
                const lChangeDetection: InteractionDetectionProxy<() => Promise<number>> = new InteractionDetectionProxy(async () => { throw lValue; });
                const lProxy: () => Promise<number> = lChangeDetection.proxy;

                // Process.
                let lResultValue: number;
                await lProxy().catch((pError) => { lResultValue = pError; });

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Hook - Async call error', async () => {
                // Setup.
                const lFunction: () => Promise<number> = async () => { throw 22; };
                const lChangeDetection: InteractionDetectionProxy<() => Promise<number>> = new InteractionDetectionProxy(lFunction);
                const lProxy: () => Promise<number> = lChangeDetection.proxy;

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.onChange = (_pTargetObject: { a: number; }, pPropertyName: any) => {
                    if (pPropertyName === lFunction) {
                        lPropertyChanged = true;
                    }
                };

                // Process
                await lProxy().catch((pError) => { /* Empty */ });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });
        });

        describe('-- getOwnPropertyDescriptor', () => {
            it('-- Default', () => {
                // Setup.
                const lValue: number = 22;
                const lOriginalObject: { a: number; } = { a: lValue };
                const lChangeDetection: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                const lResultValue: PropertyDescriptor = Object.getOwnPropertyDescriptor(lChangeDetection.proxy, 'a');

                // Evaluation.
                expect(lResultValue.value).to.equal(lValue);
            });

            it('-- OBSERVER_DESCRIPTOR_KEY', () => {
                // Setup.
                const lOriginalObject: { a: number; } = { a: 22 };
                const lChangeDetection: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                const lResultValue: PropertyDescriptor = Object.getOwnPropertyDescriptor(lChangeDetection.proxy, (<any>InteractionDetectionProxy).OBSERVER_DESCRIPTOR_KEY);

                // Evaluation.
                expect(lResultValue.value).to.equal(lChangeDetection);
            });
        });

        it('-- ChangeDetection silent mode', () => {
            // Setup.
            const lChangeDetection = new ChangeDetection('Name', null, true);
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

            // Setup. ChangeDetection.
            let lPropertyChanged: boolean = false;
            lDetectionProxy.onChange = (_pTargetObject: { a: number; }, pPropertyName: string) => {
                if (pPropertyName === 'a') {
                    lPropertyChanged = true;
                }
            };

            // Process
            lChangeDetection.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lPropertyChanged).to.be.false;
        });
    });
});