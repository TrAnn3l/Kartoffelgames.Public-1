import { expect } from 'chai';
import { ChangeDetection, ChangeDetectionReason } from '../../../source/change_detection/change-detection';

describe('ChangeDetection', () => {
    it('Static Property: current', () => {
        it('-- Available Zone', () => {
            // Setup.
            const lName: string = 'InnerCD';
            const lFirstChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lSecondChangeDetection: ChangeDetection = new ChangeDetection(lName);

            // Process.
            let lCurrentChangeDetectionName: string;
            lFirstChangeDetection.execute(() => {
                lSecondChangeDetection.execute(() => {
                    lCurrentChangeDetectionName = ChangeDetection.current.name;
                });
            });

            // Evaluation.
            expect(lCurrentChangeDetectionName).to.equal(lName);
        });

        it('-- No Zone', () => {
            // Process.
            const lCurrentChangeDetection: ChangeDetection = ChangeDetection.current;

            // Evaluation.
            expect(lCurrentChangeDetection).to.be.null;
        });
    });

    describe('Static Property: currentNoneSilent', () => {
        it('-- Parent is none silent', () => {
            // Setup.
            const lName: string = 'InnerCD';
            const lNoneSilentChangeDetection: ChangeDetection = new ChangeDetection(lName);
            const lSilentChangeDetection: ChangeDetection = new ChangeDetection('Name', lNoneSilentChangeDetection, true);

            // Process.
            let lCurrentChangeDetectionName: string;
            lNoneSilentChangeDetection.execute(() => {
                lSilentChangeDetection.execute(() => {
                    lCurrentChangeDetectionName = ChangeDetection.currentNoneSilent.name;
                });
            });

            // Evaluation.
            expect(lCurrentChangeDetectionName).to.equal(lName);
        });

        it('-- No zone', () => {
            // Process.
            const lCurrentNoneSilentChangeDetection: ChangeDetection = ChangeDetection.currentNoneSilent;

            // Evaluation.
            expect(lCurrentNoneSilentChangeDetection).to.be.null;
        });

        it('-- No none silent zone', () => {
            // Setup.
            const lName: string = 'InnerCD';
            const lNoneSilentChangeDetection: ChangeDetection = new ChangeDetection(lName, null, true);

            // Process.
            let lCurrentChangeDetection: ChangeDetection;
            lNoneSilentChangeDetection.execute(() => {
                lCurrentChangeDetection = ChangeDetection.currentNoneSilent;
            });

            // Evaluation.
            expect(lCurrentChangeDetection).to.be.null;
        });
    });

    it('Property: isSilent', () => {
        // Setup.
        const lSilentState: boolean = true;
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name', null, lSilentState);

        // Process.
        const lIsSilent: boolean = lChangeDetection.isSilent;

        // Evaluation.
        expect(lIsSilent).to.equal(lSilentState);
    });

    it('Property: name', () => {
        // Setup.
        const lName: string = 'CD-Name';
        const lChangeDetection: ChangeDetection = new ChangeDetection(lName);

        // Process.
        const lNameResult: string = lChangeDetection.name;

        // Evaluation.
        expect(lNameResult).to.equal(lName);
    });

    describe('Property: parent', () => {
        it('-- Set parent', () => {
            // Setup.
            const lParentName: string = 'InnerCD';
            const lParentChangeDetection: ChangeDetection = new ChangeDetection(lParentName);
            const lChildChangeDetection: ChangeDetection = new ChangeDetection('Name', lParentChangeDetection);

            // Process.
            const lParentChangeDetectionName: string = lChildChangeDetection.parent.name;

            // Evaluation.
            expect(lParentChangeDetectionName).to.equal(lParentName);
        });

        it('-- No parent', () => {
            // Setup.
            const lChildChangeDetection: ChangeDetection = new ChangeDetection('Name');

            // Process.
            const lParentChangeDetection: ChangeDetection = lChildChangeDetection.parent;

            // Evaluation.
            expect(lParentChangeDetection).to.be.null;
        });
    });

    it('Method: addChangeListener', () => {
        // Setup.
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lChangeDetection.addChangeListener(lListener);

        // Process. Call listener.
        lChangeDetection.dispatchChangeEvent(null);

        // Evaluation.
        expect(lListenerCalled).to.be.true;
    });

    it('Method: addErrorListener', () => {
        // Setup.
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lChangeDetection.addErrorListener(lListener);

        // Process. Call listener.
        lChangeDetection.dispatchErrorEvent(null);

        // Evaluation.
        expect(lListenerCalled).to.be.true;
    });

    it('Method: createChildDetection', () => {
        // Setup.
        const lParentName: string = 'CD-parent';
        const lChildName: string = 'CD-child';
        const lParentChangeDetection: ChangeDetection = new ChangeDetection(lParentName);

        // Process.
        const lChildChangeDetection: ChangeDetection = lParentChangeDetection.createChildDetection(lChildName);
        const lParentNameResult: string = lChildChangeDetection.parent.name;
        const lChildNameResult: string = lChildChangeDetection.name;

        // Evaluation.
        expect(lParentNameResult).to.equal(lParentName);
        expect(lChildNameResult).to.equal(lChildName);
    });

    describe('Method: dispatchChangeEvent', () => {
        it('-- Default', () => {
            // Setup.
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lReason: ChangeDetectionReason = { source: 1, property: 2, stacktrace: '3' };

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            let lReasonResult: ChangeDetectionReason;
            const lListener = (pReason: ChangeDetectionReason) => {
                lListenerCalled = true;
                lReasonResult = pReason;
            };
            lChangeDetection.addChangeListener(lListener);

            // Process. Call listener.
            lChangeDetection.dispatchChangeEvent(lReason);

            // Evaluation.
            expect(lListenerCalled).to.be.true;
            expect(lReasonResult).to.equal(lReason);
        });

        it('-- Silent', () => {
            // Setup.
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name', null, true);

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            const lListener = () => {
                lListenerCalled = true;
            };
            lChangeDetection.addChangeListener(lListener);

            // Process. Call listener.
            lChangeDetection.dispatchChangeEvent(null);

            // Evaluation.
            expect(lListenerCalled).to.be.false;
        });

        it('-- Pass through', () => {
            // Setup.
            const lChildChangeDetectionName: string = 'CD-child';
            const lParentChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lChangeDetection: ChangeDetection = lParentChangeDetection.createChildDetection(lChildChangeDetectionName);
            const lReason: ChangeDetectionReason = { source: 1, property: 2, stacktrace: '3' };

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            let lReasonResult: ChangeDetectionReason;
            let lExecutingChangeDetectionName: string;
            const lListener = (pReason: ChangeDetectionReason) => {
                lListenerCalled = true;
                lReasonResult = pReason;
                lExecutingChangeDetectionName = ChangeDetection.current.name;
            };
            lParentChangeDetection.addChangeListener(lListener);

            // Process. Dispatch event on child..
            lChangeDetection.dispatchChangeEvent(lReason);

            // Evaluation.
            expect(lListenerCalled).to.be.true;
            expect(lReasonResult).to.equal(lReason);
            expect(lExecutingChangeDetectionName).to.equal(lChildChangeDetectionName);
        });
    });

    describe('Method: dispatchErrorEvent', () => {
        it('-- Default', () => {
            // Setup.
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lError: number = 12;

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            let lErrorResult: number;
            const lListener = (pError: number) => {
                lListenerCalled = true;
                lErrorResult = pError;
            };
            lChangeDetection.addErrorListener(lListener);

            // Process. Call listener.
            lChangeDetection.dispatchErrorEvent(lError);

            // Evaluation.
            expect(lListenerCalled).to.be.true;
            expect(lErrorResult).to.equal(lError);
        });

        it('-- Pass through', () => {
            // Setup.
            const lChildChangeDetectionName: string = 'CD-child';
            const lParentChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lChangeDetection: ChangeDetection = lParentChangeDetection.createChildDetection(lChildChangeDetectionName);
            const lError: number = 12;

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            let lErrorResult: number;
            let lExecutingChangeDetectionName: string;
            const lListener = (pError: number) => {
                lListenerCalled = true;
                lErrorResult = pError;
                lExecutingChangeDetectionName = ChangeDetection.current.name;
            };
            lParentChangeDetection.addErrorListener(lListener);

            // Process. Dispatch event on child..
            lChangeDetection.dispatchErrorEvent(lError);

            // Evaluation.
            expect(lListenerCalled).to.be.true;
            expect(lErrorResult).to.equal(lError);
            expect(lExecutingChangeDetectionName).to.equal(lChildChangeDetectionName);
        });
    });

    it('Method: execute', () => {
        // Setup.
        const lName: string = 'CD-Name';
        const lExecutionResult: number = 12;
        const lChangeDetection: ChangeDetection = new ChangeDetection(lName);

        // Process.
        let lExecutingChangeDetectionName: string;
        const lResult: number = lChangeDetection.execute((pResult: number) => {
            lExecutingChangeDetectionName = ChangeDetection.current.name;
            return pResult;
        }, lExecutionResult);

        // Evaluation.
        expect(lExecutingChangeDetectionName).to.equal(lName);
        expect(lResult).to.equal(lExecutionResult);
    });

    it('Method: getUntrackedObject', () => {
        // Setup.
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
        const lOriginalObject: object = {};
        const lTrackedObject: object = lChangeDetection.registerObject(lOriginalObject);

        // Process.
        const lUntrackedObject: object = ChangeDetection.getUntrackedObject(lTrackedObject);

        // Evaluation.
        expect(lOriginalObject).to.not.equal(lTrackedObject);
        expect(lUntrackedObject).to.equal(lOriginalObject);
    });

    describe('Method: getZoneData', () => {
        it('-- Data on same change detection', () => {
            // Setup. Values.
            const lKey: string = 'key';
            const lValue: number = 12;

            // Setup. Set zone data.
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            lChangeDetection.setZoneData(lKey, lValue);

            // Process.
            const lResultValue: number = lChangeDetection.getZoneData(lKey);

            // Evaluation.
            expect(lResultValue).to.equal(lValue);
        });

        it('-- Data on parent change detection', () => {
            // Setup. Values.
            const lKey: string = 'key';
            const lValue: number = 12;

            // Setup. Set zone data.
            const lParentChangeDetection: ChangeDetection = new ChangeDetection('Name');
            lParentChangeDetection.setZoneData(lKey, lValue);
            const lChildChangeDetection: ChangeDetection = lParentChangeDetection.createChildDetection('Child');

            // Process.
            const lResultValue: number = lChildChangeDetection.getZoneData(lKey);

            // Evaluation.
            expect(lResultValue).to.equal(lValue);
        });
    });

    describe('Method: registerObject', () => {
        it('-- EventTarget input event', () => {
            // Setup.
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lEventTarget: EventTarget = new EventTarget();

            // Process. Track object.
            const lTrackedEventTarget: EventTarget = lChangeDetection.registerObject(lEventTarget);

            // Process. Track change event.
            let lChangeEventCalled: boolean = false;
            lChangeDetection.addChangeListener(() => {
                lChangeEventCalled = true;
            });

            // Process. Call input event.
            lTrackedEventTarget.dispatchEvent(new Event('input'));

            // Evaluation.
            expect(lChangeEventCalled).to.be.true;
        });

        it('-- Object change detection', () => {
            // Setup.
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lOriginalObject: { a: number; } = { a: 1 };

            // Process. Track object.
            const lTrackedEventTarget: { a: number; } = lChangeDetection.registerObject(lOriginalObject);

            // Process. Track change event.
            let lChangeEventCalled: boolean = false;
            let lReason: ChangeDetectionReason;
            lChangeDetection.addChangeListener((pReason: ChangeDetectionReason) => {
                lChangeEventCalled = true;
                lReason = pReason;
            });

            // Process. Change detection.
            lTrackedEventTarget.a = 2;

            // Evaluation.
            expect(lChangeEventCalled).to.be.true;
            expect(lReason.property).to.equal('a');
        });
    });

    it('Method: removeChangeListener', () => {
        // Setup.
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');

        // Process. Add and remove listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lChangeDetection.addChangeListener(lListener);
        lChangeDetection.removeChangeListener(lListener);

        // Process. Call listener.
        lChangeDetection.dispatchChangeEvent(null);

        // Evaluation.
        expect(lListenerCalled).to.be.false;
    });

    it('Method: addErrorListener', () => {
        // Setup.
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');

        // Process. Add and remove listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lChangeDetection.addErrorListener(lListener);
        lChangeDetection.removeErrorListener(lListener);

        // Process. Call listener.
        lChangeDetection.dispatchErrorEvent(null);

        // Evaluation.
        expect(lListenerCalled).to.be.false;
    });

    it('Method: setZoneData', () => {
        // Setup. Values.
        const lKey: string = 'key';
        const lValue: number = 12;

        // Process. Set zone data.
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
        lChangeDetection.setZoneData(lKey, lValue);

        // Process. Get zone data.
        const lResultValue: number = lChangeDetection.getZoneData(lKey);

        // Evaluation.
        expect(lResultValue).to.equal(lValue);
    });

    it('Method: silentExecution', () => {
        // Setup.
        const lExecutionResult: number = 12;
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');

        // Process.
        let lIsSilent: boolean;
        const lResult: number = lChangeDetection.silentExecution((pResult: number) => {
            lIsSilent = ChangeDetection.current.isSilent;
            return pResult;
        }, lExecutionResult);

        // Evaluation.
        expect(lIsSilent).to.be.true;
        expect(lResult).to.equal(lExecutionResult);
    });

    it('Functionality: Zone error report', () => {
        // Setup.
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
        const lError: number = 12;

        // Process. Set error listener.
        let lErrorListenerCalled: boolean = false;
        let lErrorResult: number;
        lChangeDetection.addErrorListener((pError: number) => {
            lErrorListenerCalled = true;
            lErrorResult = pError;
        });

        // Process. Throw error in zone.
        let lErrorCatched: number;
        try {
            lChangeDetection.execute(() => {
                throw lError;
            });
        } catch (pError) {
            lErrorCatched = pError;
        }

        // Evaluation.
        expect(lErrorListenerCalled).to.be.true;
        expect(lErrorResult).to.equal(lError);
        expect(lErrorCatched).to.equal(lError);
    });
});