import { expect } from 'chai';
import { ExecutionZone } from '../../../../source/change_detection/execution_zone/execution-zone';
import { Patcher } from '../../../../source/change_detection/execution_zone/patcher/patcher';
import '../../../mock/request-animation-frame-mock-session';

describe('Patcher', () => {
    describe('Static Method: patch', () => {
        it('-- default', () => {
            // Process.
            Patcher.patch(globalThis);

            // Process. Get patched and original function.
            const lPatchedFunction = requestAnimationFrame;
            const lOriginalFunction = (<any>requestAnimationFrame)[Patcher.ORIGINAL_FUNCTION_KEY];

            // Evaluation.
            expect(lPatchedFunction).has.key(<any>Patcher.ORIGINAL_FUNCTION_KEY);
            expect(lPatchedFunction).to.not.equal(lOriginalFunction);
        });

        it('-- double patch', () => {
            // Process.
            Patcher.patch(globalThis);
            Patcher.patch(globalThis);

            // Process. Get original function.
            const lOriginalFunction = (<any>requestAnimationFrame)[Patcher.ORIGINAL_FUNCTION_KEY];

            // Evaluation.
            expect(lOriginalFunction).to.not.has.key(<any>Patcher.ORIGINAL_FUNCTION_KEY);
        });
    });

    describe('Static Method: patchObject', () => {
        it('-- default', () => {
            // Setup.
            const lZone: ExecutionZone = new ExecutionZone('Name');
            const lObject = new EventTarget();

            // Process.
            Patcher.patchObject(lObject, lZone);

            // Evaluation.
            expect(lObject).to.has.key(<any>Patcher.EVENT_TARGET_PATCHED_KEY);
        });

        it('-- double patch', () => {
            // Setup.
            const lZone: ExecutionZone = new ExecutionZone('Name');
            const lObject = new EventTarget();

            // Process.
            Patcher.patchObject(lObject, lZone);
            Patcher.patchObject(lObject, lZone);

            // Evaluation.
            expect(lObject).to.have.key(<any>Patcher.EVENT_TARGET_PATCHED_KEY);
            expect((<any>lObject)[Patcher.EVENT_TARGET_PATCHED_KEY]).to.be.true;
        });
    });

    describe('Functionality: patch class', () => {
        it('-- constructor - non callback', () => {
            // Setup.
            const lValue = 11;
            const lPatcher: Patcher = new Patcher();
            const lClass = class {
                a: number = 0;
                constructor(pArgOne: number) {
                    this.a = pArgOne;
                }
            };
            (<any>lClass.prototype).b = null; // Do not patch.

            // Process.
            const lPatchedClass = (<any>lPatcher).patchClass(lClass);
            const lObject = new lPatchedClass(lValue);

            // Evaluation.
            expect(lPatchedClass).to.not.equal(lClass);
            expect(lPatchedClass).to.have.key(<any>Patcher.ORIGINAL_CLASS_KEY);
            expect(lObject.a).to.equal(lValue);
            expect((<any>lObject).b).to.be.null;
        });

        it('-- constructor - callback', () => {
            // Setup.
            const lValue = 11;
            const lCallback = () => { return lValue; };
            const lPatcher: Patcher = new Patcher();
            const lClass = class {
                a: number = 0;
                constructor(pArgOne: () => number) {
                    this.a = pArgOne();
                }
            };
            (<any>lClass.prototype).b = null; // Do not patch.

            // Process.
            const lPatchedClass = (<any>lPatcher).patchClass(lClass);
            const lObject = new lPatchedClass(lCallback);

            // Evaluation.
            expect(lPatchedClass).to.not.equal(lClass);
            expect(lPatchedClass).to.have.key(<any>Patcher.ORIGINAL_CLASS_KEY);
            expect(lObject.a).to.equal(lValue);
            expect((<any>lObject).b).to.be.null;
        });

        it('-- methods', () => {
            // Setup.
            const lValue = 11;
            const lPatcher: Patcher = new Patcher();
            const lClass = class { method(pArgOne: number) { return pArgOne; } };
            const lOriginalFunction = lClass.prototype.method;

            // Process.
            const lPatchedClass = (<any>lPatcher).patchClass(lClass);
            const lPatchedFunction = lPatchedClass.prototype.method;
            const lObject = new lPatchedClass();

            // Evaluation.
            expect(lPatchedFunction).to.not.equal(lOriginalFunction);
            expect(lPatchedFunction).to.have.key(<any>Patcher.ORIGINAL_FUNCTION_KEY);
            expect(lObject.method(lValue)).to.equal(lValue);
        });
    });

    describe('Functionality: patch EventTarget', () => {
        it('-- Patch addEventListener', () => {
            // Setup.
            const lPatcher: Patcher = new Patcher();

            // Process.
            (<any>lPatcher).patchEventTarget(globalThis);

            // Evaluation.
            expect(globalThis.EventTarget.prototype.addEventListener).to.have.key(<any>Patcher.ORIGINAL_FUNCTION_KEY);
        });

        it('-- Call addEventListener', () => {
            // Setup.
            let lListenerCalled = false;
            const lPatcher: Patcher = new Patcher();
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            const lFunction = () => { lListenerCalled = true; };
            (<any>lPatcher).patchEventTarget(globalThis);
            lEventTarget.addEventListener('click', lFunction);
            lEventTarget.dispatchEvent(new Event('click'));

            // Evaluation.
            expect(lFunction).to.have.key(<any>Patcher.PATCHED_FUNCTION_KEY);
            expect(lListenerCalled).to.be.true;
        });

        it('-- Patch removeEventListener', () => {
            // Setup.
            const lPatcher: Patcher = new Patcher();

            // Process.
            (<any>lPatcher).patchEventTarget(globalThis);

            // Evaluation.
            expect(globalThis.EventTarget.prototype.removeEventListener).to.have.key(<any>Patcher.ORIGINAL_FUNCTION_KEY);
        });

        it('-- Call removeEventListener', () => {
            // Setup.
            let lListenerCalled = false;
            const lPatcher: Patcher = new Patcher();
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            const lFunction = () => { lListenerCalled = true; };
            (<any>lPatcher).patchEventTarget(globalThis);

            // Add event, remove event and trigger event.
            lEventTarget.addEventListener('click', lFunction);
            lEventTarget.removeEventListener('click', lFunction);
            lEventTarget.dispatchEvent(new Event('click'));

            // Evaluation.
            expect(lFunction).to.have.key(<any>Patcher.PATCHED_FUNCTION_KEY);
            expect(lListenerCalled).to.be.false;
        });
    });

    describe('Functionality: patchOnProperties', () => {
        it('-- Multi patch', () => {
            // Setup.
            const lObject = new class extends EventTarget { public onclick: any = null; }();
            const lFunction = () => {/* Empty */ };
            const lPatcher: Patcher = new Patcher();

            // Process.
            (<any>lPatcher).patchOnProperties(lObject, ['click']);
            (<any>lPatcher).patchOnProperties(lObject, ['click']);
            lObject.onclick = lFunction;

            // Evaluation.
            expect(lFunction).to.have.key(<any>Patcher.PATCHED_FUNCTION_KEY);
        });

        it('-- Call listener', () => {
            // Setup.
            let lListenerCalled = false;
            const lObject = new class extends EventTarget { public onclick: any = null; }();
            const lFunction = () => { lListenerCalled = true; };
            const lPatcher: Patcher = new Patcher();

            // Process.
            (<any>lPatcher).patchOnProperties(lObject, ['click']);
            lObject.onclick = lFunction;
            lObject.dispatchEvent(new Event('click'));

            // Evaluation.
            expect(lListenerCalled).to.be.true;
        });

        it('-- Add listener twice', () => {
            // Setup.
            let lListenerCallCount = 0;
            const lObject = new class extends EventTarget { public onclick: any = null; }();
            const lFunction = () => { lListenerCallCount++; };
            const lPatcher: Patcher = new Patcher();

            // Process.
            (<any>lPatcher).patchOnProperties(lObject, ['click']);
            lObject.onclick = lFunction;
            lObject.onclick = lFunction;
            lObject.dispatchEvent(new Event('click'));

            // Evaluation.
            expect(lListenerCallCount).to.equal(1);
        });

        it('-- Set on property - function', () => {
            // Setup.
            const lObject = new class extends EventTarget { public onclick: any = null; }();
            const lFunction = () => {/* Empty */ };
            const lPatcher: Patcher = new Patcher();

            // Process.
            (<any>lPatcher).patchOnProperties(lObject, ['click']);
            lObject.onclick = lFunction;

            // Evaluation.
            expect(lFunction).to.have.key(<any>Patcher.PATCHED_FUNCTION_KEY);
        });

        it('-- Set on property - none function', () => {
            // Setup.
            const lValue: number = 12;
            const lObject = new class extends EventTarget { public onclick: any = null; }();
            const lPatcher: Patcher = new Patcher();

            // Process.
            (<any>lPatcher).patchOnProperties(lObject, ['click']);
            lObject.onclick = lValue;

            // Evaluation.
            expect(lObject.onclick).to.equal(lValue);
        });

        it('-- Get on property - none function', () => {
            // Setup.
            const lValue: number = 12;
            const lObject = new class extends EventTarget { public onclick: any = null; }();
            const lPatcher: Patcher = new Patcher();

            // Process.
            (<any>lPatcher).patchOnProperties(lObject, ['click']);
            lObject.onclick = lValue;

            // Evaluation.
            expect(lObject.onclick).to.equal(lValue);
        });

        it('-- Set on property - function', () => {
            // Setup.
            const lObject = new class extends EventTarget { public onclick: any = null; }();
            const lFunction = () => {/* Empty */ };
            const lPatcher: Patcher = new Patcher();

            // Process.
            (<any>lPatcher).patchOnProperties(lObject, ['click']);
            lObject.onclick = lFunction;

            // Evaluation.
            expect(lObject.onclick).to.equal(lFunction);
        });
    });
});