import { expect } from 'chai';
import { HtmlComponent } from '../../../source/decorator/component/html-component';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/ChaiHelper';
import { TestUtil } from '../../utility/TestUtil';

describe('SlotAttribute', () => {
    it('-- Default slot', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<div $DEFAULT/>'
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lSlotName: string = TestUtil.getComponentNode<HTMLSlotElement>(lComponent, 'div slot').getAttribute('name');

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment,
            Comment,
            {
                node: HTMLDivElement,
                childs: [HTMLSlotElement]
            }
        ], true);
        expect(lSlotName).to.be.null;
    });

    it('-- Named slot', async () => {
        // Setup. Values.
        const lSlotName: string = 'slotname';

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div $${lSlotName}/>`
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lSlotNameResult: string = TestUtil.getComponentNode<HTMLSlotElement>(lComponent, 'div slot').getAttribute('name');

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment,
            Comment,
            {
                node: HTMLDivElement,
                childs: [HTMLSlotElement]
            }
        ], true);
        expect(lSlotNameResult).to.equal(lSlotName);
    });
});