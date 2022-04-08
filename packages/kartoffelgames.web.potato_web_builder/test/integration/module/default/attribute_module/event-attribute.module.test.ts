import { Exception } from '@kartoffelgames/core.data';
import { expect } from 'chai';
import { PwbExport } from '../../../../../source/default/export/pwb-export.decorator';
import { PwbComponent } from '../../../../../source/component/decorator/pwb-component.decorator';
import { PwbComponentEvent } from '../../../../../source/default/component-event/pwb-component-event.decorator';
import { ComponentEventEmitter } from '../../../../../source/default/component-event/component-event-emitter';
import '../../../../mock/request-animation-frame-mock-session';
import '../../../../utility/chai-helper';
import { TestUtil } from '../../../../utility/test-util';
import { ComponentEvent } from '../../../../../source/default/component-event/component-event';

describe('EventAttributeModule', () => {
    it('-- Basic click event', async () => {
        // Setup. Values.
        const lEventComponentSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lEventComponentSelector,
        })
        class EventComponent { }

        // Process. Define component and wait for update.
        let lEventValueResult: string = null;
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lEventComponentSelector} (click)="this.handler($event)"/>`
        })
        class TestComponent {
            public handler(pEvent: MouseEvent): void {
                lEventValueResult = pEvent.type;
            }
        }

        // Setup. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lEventChild: HTMLDivElement & EventComponent = TestUtil.getComponentNode(lComponent, lEventComponentSelector);
        lEventChild.click();

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventValueResult).to.equal('click');
    });

    it('-- Basic event-emitter event', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';
        const lEventComponentSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lEventComponentSelector,
        })
        class EventComponent {
            @PwbComponentEvent('custom-event')
            private readonly mEvent: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent(): void {
                this.mEvent.dispatchEvent(lEventValue);
            }
        }

        // Process. Define component and wait for update.
        let lEventValueResult: string = null;
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lEventComponentSelector} (custom-event)="this.handler($event)"/>`
        })
        class TestComponent {
            public handler(pEvent: ComponentEvent<string>): void {
                lEventValueResult = pEvent.value;
            }
        }

        // Setup. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lEventChild: HTMLDivElement & EventComponent = TestUtil.getComponentNode(lComponent, lEventComponentSelector);
        lEventChild.callEvent();

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventValueResult).to.equal(lEventValue);
    });

    it('-- Wrong emmiter type', async () => {
        // Setup. Values.
        const lEventComponentSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lEventComponentSelector,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class EventComponent {
            @PwbComponentEvent('custom-event')
            public mEvent: string; // Wrong type.
        }

        // Process. Define component and wait for update.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lEventComponentSelector} (custom-event)="this.handler($event)"/>`
        })
        class TestComponent {
            public handler(_pEvent: ComponentEvent<string>): void { /* Empty */ }
        }

        // Setup. Create element.
        let lErrorMessage: string;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (e) {
            lErrorMessage = e.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal('Event emiter property must be of type ComponentEventEmitter');
    });

    it('-- Clear custom events on deconstruct', async () => {
        // Setup. Values.
        const lEventComponentSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lEventComponentSelector,
        })
        class EventComponent {
            @PwbComponentEvent('custom-event')
            private readonly mEvent: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent(): void {
                this.mEvent.dispatchEvent('');
            }
        }

        // Process. Define component and wait for update.
        let lEventCalled: boolean = false;
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lEventComponentSelector} (custom-event)="this.handler($event)"/>`
        })
        class TestComponent {
            public handler(_pEvent: ComponentEvent<string>): void {
                lEventCalled = true;
            }
        }

        // Setup. Create element, deconstruct and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lEventChild: HTMLDivElement & EventComponent = TestUtil.getComponentNode(lComponent, lEventComponentSelector);
        TestUtil.deconstructComponent(lComponent);
        lEventChild.callEvent();

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventCalled).to.be.false;
    });

    it('-- Clear native events on deconstruct', async () => {
        // Setup. Values.
        let lClicked: boolean = false;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div (click)="this.handler($event)"/>`
        })
        class TestComponent {
            public handler(_pEvent: MouseEvent): void {
                lClicked = true;
            }
        }

        // Setup. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lClickableChild: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');
        TestUtil.deconstructComponent(lComponent);
        lClickableChild.click();

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lClicked).to.be.false;
    });

    it('-- Forbidden static usage', () => {
        // Process. Define component.
        const lErrorFunction = () => {
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class EventComponent {
                @PwbComponentEvent('custom-event')
                private static readonly mEvent: ComponentEventEmitter<string>;
            }
        };

        // Evaluation.
        expect(lErrorFunction).to.throw(Exception, 'Event target is not for an instanced property.');
    });

    it('-- Two parallel custom events', async () => {
        // Setup. Values.
        const lEventValueOne: string = 'EVENT-VALUE-ONE';
        const lEventValueTwo: string = 'EVENT-VALUE-Two';
        const lEventComponentSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lEventComponentSelector,
        })
        class EventComponent {
            @PwbComponentEvent('custom-event-one')
            private readonly mEventOne: ComponentEventEmitter<string>;
            @PwbComponentEvent('custom-event-two')
            private readonly mEventTwo: ComponentEventEmitter<string>;

            @PwbExport
            public callEventOne(): void {
                this.mEventOne.dispatchEvent(lEventValueOne);
            }

            @PwbExport
            public callEventTwo(): void {
                this.mEventTwo.dispatchEvent(lEventValueTwo);
            }
        }

        // Process. Define component and wait for update.
        let lEventValueResultOne: string = null;
        let lEventValueResultTwo: string = null;
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lEventComponentSelector} (custom-event-one)="this.handlerOne($event)" (custom-event-two)="this.handlerTwo($event)"/>`
        })
        class TestComponent {
            public handlerOne(pEvent: ComponentEvent<string>): void {
                lEventValueResultOne = pEvent.value;
            }
            public handlerTwo(pEvent: ComponentEvent<string>): void {
                lEventValueResultTwo = pEvent.value;
            }
        }

        // Setup. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lEventChild: HTMLDivElement & EventComponent = TestUtil.getComponentNode(lComponent, lEventComponentSelector);
        lEventChild.callEventOne();
        lEventChild.callEventTwo();

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventValueResultOne).to.equal(lEventValueOne);
        expect(lEventValueResultTwo).to.equal(lEventValueTwo);
    });

    it('-- Nativ and custom event parallel', async () => {
        // Setup. Values.
        const lEventComponentSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lEventComponentSelector,
        })
        class EventComponent {
            @PwbComponentEvent('custom-event')
            private readonly mEvent: ComponentEventEmitter<void>;

            @PwbExport
            public callEvent(): void {
                this.mEvent.dispatchEvent();
            }
        }

        // Process. Define component and wait for update.
        let lCustomCalled: boolean = false;
        let lNativeCalled: boolean = false;
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lEventComponentSelector} (custom-event)="this.customHandler($event)"  (click)="this.nativeHandler($event)"/>`
        })
        class TestComponent {
            public customHandler(_pEvent: ComponentEvent<string>): void {
                lCustomCalled = true;
            }

            public nativeHandler(_pEvent: ComponentEvent<string>): void {
                lNativeCalled = true;
            }
        }

        // Setup. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lEventChild: HTMLDivElement & EventComponent = TestUtil.getComponentNode(lComponent, lEventComponentSelector);
        lEventChild.callEvent();
        lEventChild.click();

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lCustomCalled).to.be.true;
        expect(lNativeCalled).to.be.true;
    });

    it('-- Override native events', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';
        const lEventComponentSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lEventComponentSelector,
        })
        class EventComponent {
            @PwbComponentEvent('click')
            private readonly mEvent: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent(): void {
                this.mEvent.dispatchEvent(lEventValue);
            }
        }

        // Process. Define component and wait for update.
        let lEventValueResult: string = null;
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lEventComponentSelector} (click)="this.handler($event)"/>`
        })
        class TestComponent {
            public handler(pEvent: ComponentEvent<string>): void {
                lEventValueResult = pEvent.value;
            }
        }

        // Setup. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lEventChild: HTMLDivElement & EventComponent = TestUtil.getComponentNode(lComponent, lEventComponentSelector);
        lEventChild.callEvent();

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventValueResult).to.equal(lEventValue);
    });
});