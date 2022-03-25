import { expect } from 'chai';
import { HtmlComponent } from '../../../../../source/decorator/component/html-component';
import { ComponentEventEmitter, Export, HtmlComponentEvent } from '../../../../../source/index';
import '../../../../mock/request-animation-frame-mock-session';
import '../../../../utility/ChaiHelper';
import { TestUtil } from '../../../../utility/TestUtil';

describe('EventAttributeModule', () => {
    it('Basic click event', async () => {
        // Setup. Values.
        let lClickEvent: string = null;

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div (click)="this.handler($event)"/>`
        })
        class TestComponent {
            public handler(pEvent: MouseEvent): void {
                lClickEvent = pEvent.type;
            }
        }

        // Setup. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lClickableChild: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');
        lClickableChild.click();

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lClickEvent).to.equal('click');
    });

    it('Basic event-emitter event', async () => {
        // Setup. Values.
        const lEventValue: string = 'EVENT-VALUE';
        const lEventComponentSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @HtmlComponent({
            selector: lEventComponentSelector,
        })
        class EventComponent {
            @HtmlComponentEvent('custom-event')
            private readonly mEvent: ComponentEventEmitter<string> = new ComponentEventEmitter<string>();

            @Export
            public callEvent(): void {
                this.mEvent.dispatchEvent(lEventValue);
            }
        }

        // Process. Define component and wait for update.
        let lEventValueResult: string = null;
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lEventComponentSelector} (custom-event)="this.handler($event)"/>`
        })
        class TestComponent {
            public handler(pEvent: string): void {
                lEventValueResult = pEvent;
            }
        }

        // Setup. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lEventChild: HTMLDivElement & EventComponent = TestUtil.getComponentNode(lComponent, lEventComponentSelector);
        lEventChild.callEvent();

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lEventValueResult).to.equal(lEventValue);
    });

    it('Wrong emmiter type', async () => {
        // Setup. Values.
        const lEventComponentSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @HtmlComponent({
            selector: lEventComponentSelector,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class EventComponent {
            @HtmlComponentEvent('custom-event')
            public mEvent: string = ''; // Wrong type.
        }

        // Process. Define component and wait for update.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lEventComponentSelector} (custom-event)="this.handler($event)"/>`
        })
        class TestComponent {
            public handler(pEvent: string): void { /* Empty */}
        }

        // Setup. Create element.
        let lErrorMessage: string;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (e) {
            lErrorMessage = e.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal('Event emmiter must be of type ComponentEventEmitter');
    });

    it('Clear custom events on deconstruct', async () => {
        // Setup. Values.
        const lEventComponentSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @HtmlComponent({
            selector: lEventComponentSelector,
        })
        class EventComponent {
            @HtmlComponentEvent('custom-event')
            private readonly mEvent: ComponentEventEmitter<string> = new ComponentEventEmitter<string>();

            @Export
            public callEvent(): void {
                this.mEvent.dispatchEvent('');
            }
        }

        // Process. Define component and wait for update.
        let lEventCalled: boolean = false;
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lEventComponentSelector} (custom-event)="this.handler($event)"/>`
        })
        class TestComponent {
            public handler(_pEvent: string): void {
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

    it('Clear native events on deconstruct', async () => {
        // Setup. Values.
        let lClicked: boolean = false;

        // Setup. Define component.
        @HtmlComponent({
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
});