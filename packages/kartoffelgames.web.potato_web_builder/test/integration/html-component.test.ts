import { expect } from 'chai';
import { HtmlComponent } from '../../source/decorator/component/html-component';
import '../mock/request-animation-frame-mock-session';
import '../utility/ChaiHelper';
import { TestUtil } from '../utility/TestUtil';

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

    it('-- Ignore comments', async() => {
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
});