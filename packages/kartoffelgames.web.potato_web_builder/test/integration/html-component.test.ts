import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { expect } from 'chai';
import { LoopError } from '../../source/component/handler/loop-detection-handler';
import { ComponentElementReference } from '../../source/injection_reference/component-element-reference';
import { ComponentUpdateReference } from '../../source/injection_reference/component-update-reference';
import { Export } from '../../source/default/export/export.decorator';
import { HtmlComponent } from '../../source/component/decorator/html-component.decorator';
import { ExpressionModule } from '../../source/module/decorator/expression-module.decorator';
import { UpdateScope } from '../../source/component/enum/update-scope';
import { IPwbExpressionModuleOnUpdate } from '../../source/module/interface/module';
import { IPwbAfterInit, IPwbAfterUpdate, IPwbOnAttributeChange, IPwbOnDeconstruct, IPwbOnInit, IPwbOnUpdate } from '../../source/component/interface/user-class';
import '../mock/request-animation-frame-mock-session';
import '../utility/chai-helper';
import { TestUtil } from '../utility/test-util';

describe('HtmlComponent', () => {
    it('-- Single element', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<div/>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([Comment, HTMLDivElement], true);
    });

    it('-- Sibling element', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<div/><span/>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div, Span.
        expect(lComponent.shadowRoot.childNodes).to.have.lengthOf(3);
        expect(lComponent).to.have.componentStructure([Comment, HTMLDivElement, HTMLSpanElement], true);
    });

    it('-- Child element', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<div><span/></div>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot.childNodes).to.have.lengthOf(2);
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
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<div><!-- Comment --></div>'
        })
        class TestComponent { }


        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, Div.
        expect(lComponent.shadowRoot.childNodes).to.have.lengthOf(2);
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
        @HtmlComponent({
            selector: lChildSelector
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestChildComponent { }

        // Setup. Define parent component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lChildSelector}/><${lChildSelector}/>`
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);
        const lFirstChild: HTMLElement = <HTMLElement>lComponent.shadowRoot.childNodes[1];
        const lSecondChild: HTMLElement = <HTMLElement>lComponent.shadowRoot.childNodes[2];

        // Evaluation
        expect(lFirstChild).instanceOf(HTMLElement);
        expect(lSecondChild).instanceOf(HTMLElement);
        expect(lFirstChild).to.not.be.equal(lSecondChild);
    });

    it('-- No template', async () => {
        // Setup. Define component.
        @HtmlComponent({
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
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            style: lStyleContent
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);
        const lStyleElement: HTMLStyleElement = <HTMLStyleElement>lComponent.shadowRoot.childNodes[0];

        // Evaluation
        expect(lComponent).to.have.componentStructure([
            HTMLStyleElement,
            Comment
        ], true);
        expect(lStyleElement.textContent).to.equal(lStyleContent);
    });

    it('-- Manual update. No initial update.', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<div />',
            updateScope: UpdateScope.Manual
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent.shadowRoot.childNodes).to.have.lengthOf(1);
    });

    it('-- Manual update. User triggered update.', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<div />',
            updateScope: UpdateScope.Manual
        })
        class TestComponent {
            private readonly mUpdateReference: ComponentUpdateReference;
            public constructor(pUpdateReference: ComponentUpdateReference) {
                this.mUpdateReference = pUpdateReference;
            }

            @Export
            public update(): void {
                this.mUpdateReference.update();
            }
        }

        // Process. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.update();
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent.shadowRoot.childNodes).to.have.lengthOf(2);
    });

    it('-- Capsuled update scope', () => {
        // TODO:
    });

    it('-- custom expression module', async () => {
        // Setup.
        const lExpressionValue: string = 'EXPRESSION-VALUE';

        // Setup. Custom expression module.
        @ExpressionModule({
            selector: /&&.*&&/
        })
        class TestExpressionModule implements IPwbExpressionModuleOnUpdate {
            public onUpdate(): string {
                return lExpressionValue;
            }
        }

        // Setup. Define component.
        @HtmlComponent({
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
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<unknowncomponent/>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, unknown-component.
        expect(lComponent.shadowRoot.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([Comment, HTMLUnknownElement], true);
    });

    it('-- Create HTMLElement on unknown component', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<unknown-component/>'
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Evaluation
        // 2 => StaticAnchor, unknown-component.
        expect(lComponent.shadowRoot.childNodes).to.have.lengthOf(2);
        expect(lComponent).to.have.componentStructure([Comment, HTMLElement], true); // HTMLUnknownElement not creates in JSDOM.
    });

    it('-- Element reference', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
        })
        class TestComponent {
            private readonly mElementReference: ComponentElementReference;
            public constructor(pElementReference: ComponentElementReference) {
                this.mElementReference = pElementReference;
            }

            @Export
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
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<div>{{this.innerValue}}</div>'
        })
        class TestComponent implements IPwbOnInit, IPwbAfterInit, IPwbOnUpdate, IPwbAfterUpdate, IPwbOnAttributeChange, IPwbOnDeconstruct {
            @Export
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

    it('-- Loop detection', async () => {
        // Setup. Define component.
        @HtmlComponent({
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
            await <any>TestUtil.createComponent(TestComponent);
        } catch (e) {
            lError = e;
        }

        // Evaluation.
        expect(lError).to.be.instanceOf(LoopError);
    });
});