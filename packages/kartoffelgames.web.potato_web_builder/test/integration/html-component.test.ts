import { ChangeDetection, ChangeDetectionReason } from '@kartoffelgames/web.change-detection';
import { expect } from 'chai';
import { PwbComponent } from '../../source/component/decorator/pwb-component.decorator';
import { UpdateScope } from '../../source/component/enum/update-scope';
import { LoopError } from '../../source/component/handler/loop-detection-handler';
import { IPwbAfterInit, IPwbAfterUpdate, IPwbOnAttributeChange, IPwbOnDeconstruct, IPwbOnInit, IPwbOnUpdate } from '../../source/component/interface/user-class';
import { PwbExport } from '../../source/default/export/pwb-export.decorator';
import { ComponentElementReference } from '../../source/injection_reference/component-element-reference';
import { ComponentUpdateReference } from '../../source/injection_reference/component-update-reference';
import { PwbExpressionModule } from '../../source/module/decorator/pwb-expression-module.decorator';
import { IPwbExpressionModuleOnUpdate } from '../../source/module/interface/module';
import '../mock/request-animation-frame-mock-session';
import '../utility/chai-helper';
import { TestUtil } from '../utility/test-util';

describe('HtmlComponent', () => {
    it('-- Single element', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div/>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([Comment, HTMLDivElement], true);
    });

    it('-- Sibling element', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div/><span/>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div, Span.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(3);
        expect(lComponent).to.have.componentStructure([Comment, HTMLDivElement, HTMLSpanElement], true);
    });

    it('-- Child element', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div><span/></div>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([
            Comment,
            {
                node: HTMLDivElement,
                childs: [HTMLSpanElement]
            }
        ], true);
    });

    it('-- Ignore comments', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div><!-- Comment --></div>'
        })
        class TestComponent { }


        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([
            Comment,
            {
                node: HTMLDivElement,
                childs: []
            }
        ], true);
    });

    it('-- Same component childs', async () => {
        // Setup. Define child component.
        const lChildSelector: string = TestUtil.randomSelector();
        @PwbComponent({
            selector: lChildSelector
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestChildComponent { }

        // Setup. Define parent component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lChildSelector}/><${lChildSelector}/>`
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);
        const lFirstChild: HTMLElement = <HTMLElement>(<ShadowRoot>lComponent.shadowRoot).childNodes[1];
        const lSecondChild: HTMLElement = <HTMLElement>(<ShadowRoot>lComponent.shadowRoot).childNodes[2];

        // Evaluation
        expect(lFirstChild).instanceOf(HTMLElement);
        expect(lSecondChild).instanceOf(HTMLElement);
        expect(lFirstChild).to.not.be.equal(lSecondChild);
    });

    it('-- No template', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        expect(lComponent).to.have.componentStructure([
            Comment
        ], true);
    });

    it('-- Add local styles', async () => {
        const lStyleContent: string = 'p {color: red;}';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            style: lStyleContent
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);
        const lStyleElement: HTMLStyleElement = <HTMLStyleElement>(<ShadowRoot>lComponent.shadowRoot).childNodes[0];

        // Evaluation
        expect(lComponent).to.have.componentStructure([
            HTMLStyleElement,
            Comment
        ], true);
        expect(lStyleElement.textContent).to.equal(lStyleContent);
    });

    it('-- Manual update. No initial update.', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div />',
            updateScope: UpdateScope.Manual
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(1);
    });

    it('-- Manual update. User triggered update.', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div />',
            updateScope: UpdateScope.Manual
        })
        class TestComponent {
            private readonly mUpdateReference: ComponentUpdateReference;
            public constructor(pUpdateReference: ComponentUpdateReference) {
                this.mUpdateReference = pUpdateReference;
            }

            @PwbExport
            public update(): void {
                this.mUpdateReference.update();
            }
        }

        // Process. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.update();
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
    });

    it('-- Capsuled update scope', async () => {
        // Setup.
        const lCapsuledSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lCapsuledSelector,
            template: '{{this.innerValue}}',
            updateScope: UpdateScope.Capsuled
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class CapsuledTestComponent {
            @PwbExport
            public innerValue: string = '';
        }

        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lCapsuledSelector}/>`,
            updateScope: UpdateScope.Global
        })
        class TestComponent { }

        // Process. Create and initialize element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        await TestUtil.waitForUpdate(lComponent);
        const lCapsuledContent: HTMLElement & CapsuledTestComponent = <any>(<ShadowRoot>lComponent.shadowRoot).childNodes[1];
        await TestUtil.waitForUpdate(lComponent);
        await TestUtil.waitForUpdate(lCapsuledContent);

        // Set update listener.
        let lWasUpdated: boolean = false;
        TestUtil.getComponentManager(lComponent)?.updateHandler.addUpdateListener((pReason: ChangeDetectionReason) => {
            lWasUpdated = pReason.property === 'innerValue' || lWasUpdated;
        });

        // Set update listener.
        let lInnerValueWasUpdated: boolean = false;
        TestUtil.getComponentManager(lCapsuledContent)?.updateHandler.addUpdateListener((pReason: ChangeDetectionReason) => {
            lInnerValueWasUpdated = pReason.property === 'innerValue' || lInnerValueWasUpdated;
        });

        // Proccess. Change Capsuled value.
        lCapsuledContent.innerValue = '12';
        await TestUtil.waitForUpdate(lComponent);
        await TestUtil.waitForUpdate(lCapsuledContent);

        // Evaluation.
        expect(lWasUpdated).to.be.false;
        expect(lInnerValueWasUpdated).to.be.true;
    });

    it('-- custom expression module', async () => {
        // Setup.
        const lExpressionValue: string = 'EXPRESSION-VALUE';

        // Setup. Custom expression module.
        @PwbExpressionModule({
            selector: /&&.*&&/
        })
        class TestExpressionModule implements IPwbExpressionModuleOnUpdate {
            public onUpdate(): string {
                return lExpressionValue;
            }
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div>&&Anything&&</div>',
            expressionmodule: TestExpressionModule
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lExpressionValue
            }
        ], true);
    });

    it('-- Create HTMLUnknownElement on unknown element', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<unknowncomponent/>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, unknown-component.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([Comment, HTMLUnknownElement], true);
    });

    it('-- Create HTMLElement on unknown component', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<unknown-component/>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, unknown-component.
        expect(lComponent.shadowRoot?.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([Comment, HTMLElement], true); // HTMLUnknownElement not creates in JSDOM.
    });

    it('-- Element reference', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class TestComponent {
            private readonly mElementReference: ComponentElementReference;
            public constructor(pElementReference: ComponentElementReference) {
                this.mElementReference = pElementReference;
            }

            @PwbExport
            public element(): Node {
                return this.mElementReference.value;
            }
        }

        // Process. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lComponentReference: HTMLElement = <HTMLElement>ChangeDetection.getUntrackedObject(lComponent.element());

        // Evaluation
        // 2 => StaticAnchor, unknown-component.
        expect(lComponent).to.equal(lComponentReference);
    });

    it('-- User callbacks', async () => {
        // Setup.
        const lCallPosition = {
            onPwbInitialize: 1,
            afterPwbInitialize: 2,
            onPwbUpdate: 3,
            afterPwbUpdate: 4,
            onPwbAttributeChange: 5,
            onPwbDeconstruct: 6,
        };

        // Process.
        const lExpectedCallOrder: Array<number> = new Array<number>();

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div>{{this.innerValue}}</div>'
        })
        class TestComponent implements IPwbOnInit, IPwbAfterInit, IPwbOnUpdate, IPwbAfterUpdate, IPwbOnAttributeChange, IPwbOnDeconstruct {
            @PwbExport
            public innerValue: string = 'DUMMY-VALUE';

            private mAfterPwbUpdateCalled: boolean = false;
            private mOnPwbUpdateCalled: boolean = false;

            public afterPwbInitialize(): void {
                lExpectedCallOrder.push(lCallPosition.afterPwbInitialize);
            }

            public afterPwbUpdate(): void {
                // Update can be called multiple times.
                if (!this.mAfterPwbUpdateCalled) {
                    this.mAfterPwbUpdateCalled = true;
                    lExpectedCallOrder.push(lCallPosition.afterPwbUpdate);
                }
            }

            public onPwbAttributeChange(_pAttributeName: string): void {
                lExpectedCallOrder.push(lCallPosition.onPwbAttributeChange);
            }

            public onPwbDeconstruct(): void {
                lExpectedCallOrder.push(lCallPosition.onPwbDeconstruct);
            }

            public onPwbInitialize(): void {
                lExpectedCallOrder.push(lCallPosition.onPwbInitialize);
            }

            public onPwbUpdate(): void {
                // Update can be called multiple times.
                if (!this.mOnPwbUpdateCalled) {
                    this.mOnPwbUpdateCalled = true;
                    lExpectedCallOrder.push(lCallPosition.onPwbUpdate);
                }
            }
        }

        // Process. Create element indirect callback.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.innerValue = 'New-Value';
        TestUtil.deconstructComponent(lComponent);

        // Evaluation.
        expect(lExpectedCallOrder).to.deep.equal(
            [
                lCallPosition.onPwbInitialize,
                lCallPosition.afterPwbInitialize,
                lCallPosition.onPwbUpdate,
                lCallPosition.afterPwbUpdate,
                lCallPosition.onPwbAttributeChange,
                lCallPosition.onPwbDeconstruct,
            ]
        );
    });

    it('-- Deconstruct Manual', async () => {
        // Process. Define component.
        let lWasDeconstructed: boolean = false;
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            updateScope: UpdateScope.Manual
        })
        class TestComponent implements IPwbOnDeconstruct {
            public onPwbDeconstruct(): void {
                lWasDeconstructed = true;
            }
        }

        // Process. Create element indirect callback.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);

        // Evaluation.
        expect(lWasDeconstructed).to.be.true;
    });

    it('-- Loop detection', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div>{{this.innerValue}}</div>'
        })
        class TestComponent implements IPwbAfterUpdate {
            public innerValue: number = 1;

            private readonly mUpdateReference: ComponentUpdateReference;
            public constructor(pUpdateReference: ComponentUpdateReference) {
                this.mUpdateReference = pUpdateReference;
            }

            public afterPwbUpdate(): void {
                // Trigger update again after update.
                this.triggerUpdate();
            }

            private triggerUpdate(): void {
                this.innerValue++;
                this.mUpdateReference.update();
            }
        }

        // Process. Create element.
        let lError: any;
        try {
            await <any>TestUtil.createComponent(TestComponent, true);
        } catch (e) {
            lError = e;
        }

        // Evaluation.
        expect(lError).to.be.instanceOf(LoopError);
    });

    it('-- Creation without PwbApp', async () => {
        // Setup.
        const lSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestComponent { }

        // Process. Create element.
        const lComponentConstructor: CustomElementConstructor | undefined = window.customElements.get(lSelector);
        let lComponent: HTMLElement | null = null;
        if (lComponentConstructor) {
            lComponent = new lComponentConstructor();
        }

        // Evaluation.
        expect(lComponent).to.be.instanceOf(HTMLElement);
    });
});