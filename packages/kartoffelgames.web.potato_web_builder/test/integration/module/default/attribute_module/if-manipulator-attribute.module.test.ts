import { expect } from 'chai';
import { PwbExport } from '../../../../../source/default/export/pwb-export.decorator';
import { PwbComponent } from '../../../../../source/component/decorator/pwb-component.decorator';
import '../../../../mock/request-animation-frame-mock-session';
import '../../../../utility/chai-helper';
import { TestUtil } from '../../../../utility/test-util';

describe('IfManipulatorAttributeModule', () => {
    it('Initial false', async () => {
        // Setup. Values.
        const lDisplayed: boolean = false;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbIf="this.displayed"/>`
        })
        class TestComponent {
            public displayed: boolean = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
        ], true);
    });

    it('Initial true', async () => {
        // Setup. Values.
        const lDisplayed: boolean = true;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbIf="this.displayed"/>`
        })
        class TestComponent {
            public displayed: boolean = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator Child Anchor
            HTMLDivElement
        ], true);
    });

    it('Updated false', async () => {
        // Setup. Values.
        const lDisplayed: boolean = false;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbIf="this.displayed"/>`
        })
        class TestComponent {
            @PwbExport
            public displayed: boolean = !lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.displayed = lDisplayed;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
        ], true);
    });

    it('Updated true', async () => {
        // Setup. Values.
        const lDisplayed: boolean = true;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbIf="this.displayed"/>`
        })
        class TestComponent {
            @PwbExport
            public displayed: boolean = !lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.displayed = lDisplayed;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator Child Anchor
            HTMLDivElement
        ], true);
    });

    it('None boolean false value', async () => {
        // Setup. Values.
        const lDisplayed: any = null;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbIf="this.displayed"/>`
        })
        class TestComponent {
            public displayed: any = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
        ], true);
    });

    it('None boolean true value', async () => {
        // Setup. Values.
        const lDisplayed: any = new Object();

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbIf="this.displayed"/>`
        })
        class TestComponent {
            public displayed: any = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator Child Anchor
            HTMLDivElement
        ], true);
    });
});