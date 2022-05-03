import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { expect } from 'chai';
import { PwbComponent } from '../../../source/component/decorator/pwb-component.decorator';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

// eslint-disable-next-line @typescript-eslint/naming-convention
const HTMLSlotElement: InjectionConstructor = <any>document.createElement('slot').constructor;

describe('SlotAttribute', () => {
    it('-- Default slot', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div $DEFAULT/>'
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lSlotName: string | null = TestUtil.getComponentNode<HTMLSlotElement>(lComponent, 'div slot').getAttribute('name');

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator Child Anchor
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
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div $${lSlotName}/>`
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator Child Anchor
            {
                node: HTMLDivElement,
                childs: [{
                    node: HTMLSlotElement,
                    attributes: [{ name: 'name', value: lSlotName, }]
                }]
            }
        ], true);
    });
});