import { expect } from 'chai';
import { Export } from '../../../../../source/component/decorator/export';
import { HtmlComponent } from '../../../../../source/component/decorator/html-component';
import '../../../../mock/request-animation-frame-mock-session';
import '../../../../utility/chai-helper';
import { TestUtil } from '../../../../utility/test-util';

describe('OneWayBindingAttribute', () => {
    it('-- Initial value', async () => {
        // Setup. Define values.
        const lInitialValue: string = 'INITIAL__VALUE';

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<input [value]="this.userValue"/>'
        })
        class TestComponent {
            @Export
            public userValue: string = lInitialValue;
        }

        // Setup. Create element.
        const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

        // Process. Get input value.
        const lInputValue: string = TestUtil.getComponentNode<HTMLInputElement>(lComponent, 'input').value;

        // Evaluation.
        expect(lInputValue).to.equal(lInitialValue);
    });

    it('-- Change component value', async () => {
        // Setup. Define values.
        const lNewValue: string = 'NEW__VALUE';

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: '<input [value]="this.userValue"/>'
        })
        class TestComponent {
            @Export
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