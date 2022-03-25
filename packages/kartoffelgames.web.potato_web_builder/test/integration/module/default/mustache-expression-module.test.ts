import { expect } from 'chai';
import { HtmlComponent } from '../../../../source/decorator/component/html-component';
import { Export } from '../../../../source/index';
import '../../../mock/request-animation-frame-mock-session';
import '../../../utility/ChaiHelper';
import { TestUtil } from '../../../utility/TestUtil';

describe('MustacheExpressionModule', () => {
    it('Initial value', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div>{{this.mText}}</div>`
        })
        class TestComponent {
            public readonly mText: string = lTextContent;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);
    });

    it('Updated value', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div>{{this.text}}</div>`
        })
        class TestComponent {
            @Export
            public text: string;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.text = lTextContent;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);
    });
});