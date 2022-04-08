import { expect } from 'chai';
import { PwbExport } from '../../../source/default/export/pwb-export.decorator';
import { PwbComponent } from '../../../source/component/decorator/pwb-component.decorator';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('TwoWayBindingAttributeModule', () => {
    it('-- Initial value', async () => {
        // Setup. Define values.
        const lInitialValue: string = 'INITIAL__VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<input [(value)]="this.userValue"/>'
        })
        class TestComponent {
            @PwbExport
            public userValue: string = lInitialValue;
        }

        // Setup. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Process. Get input value.
        const lInputValue: string = TestUtil.getComponentNode<HTMLInputElement>(lComponent, 'input').value;

        // Evaluation.
        expect(lInputValue).to.equal(lInitialValue);
    });

    it('-- Change view value', async () => {
        // Setup. Define values.
        const lNewValue: string = 'NEW__VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<input [(value)]="this.userValue"/>'
        })
        class TestComponent {
            @PwbExport
            public userValue: string = 'INITIAL__VALUE';
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Process. Get input value.
        TestUtil.getComponentNode<HTMLInputElement>(lComponent, 'input').value = lNewValue;
        TestUtil.manualUpdate(lComponent); // Manual element value set does not trigger change detection.  
        await TestUtil.waitForUpdate(lComponent);
        const lComponentValue: string = lComponent.userValue;

        // Evaluation.
        expect(lComponentValue).to.equal(lNewValue);
    });

    it('-- Change component value', async () => {
        // Setup. Define values.
        const lNewValue: string = 'NEW__VALUE';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<input [(value)]="this.userValue"/>'
        })
        class TestComponent {
            @PwbExport
            public userValue: string = 'INITIAL__VALUE';
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Process. Get input value.
        lComponent.userValue = lNewValue;
        await TestUtil.waitForUpdate(lComponent);
        const lViewValue: string = TestUtil.getComponentNode<HTMLInputElement>(lComponent, 'input').value;

        // Evaluation.
        expect(lViewValue).to.equal(lNewValue);
    });
});