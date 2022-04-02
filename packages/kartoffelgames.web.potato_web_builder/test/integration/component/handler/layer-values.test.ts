import { expect } from 'chai';
import { LayerValues } from '../../../../source';
import { ComponentConnection } from '../../../../source/component/component-connection';
import { ComponentManager } from '../../../../source/component/component-manager';
import { HtmlComponent } from '../../../../source/decorator/component/html-component';
import { TestUtil } from '../../../utility/TestUtil';
import '../../../mock/request-animation-frame-mock-session';
import '../../../utility/ChaiHelper';

describe('LayerValues', () => {
    it('-- Underlying component values', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // 
        const lComponentManager: ComponentManager = ComponentConnection.componentManagerOf(lComponent);
        const lRootValuesComponentManager: ComponentManager = lComponentManager.rootValues.componentManager;

        // Evaluation.
        expect(lRootValuesComponentManager).to.equal(lComponentManager);
    });

    it('-- Get child root value', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lRootValues: LayerValues = ComponentConnection.componentManagerOf(lComponent).rootValues.rootValue;

        // Process. Create child layer.
        const lChildLayer: LayerValues = new LayerValues(lRootValues);
        const lRootLayerResult: LayerValues = lChildLayer.rootValue;

        // Evaluation.
        expect(lRootLayerResult).to.equal(lRootValues);
    });

    describe('-- Equal', () => {
        it('-- Everything equal', async () => {
            // Setup. Define component.
            @HtmlComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: LayerValues = ComponentConnection.componentManagerOf(lComponent).rootValues;

            // Process. Create child layer.
            const lIsEqual: boolean = lRootValues.equal(lRootValues);

            // Evaluation.
            expect(lIsEqual).to.be.true;
        });

        it('-- Different user object', async () => {
            // Setup. Define component one.
            @HtmlComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponentOne { }

            // Setup. Define component two.
            @HtmlComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponentTwo { }

            // Setup. Create element.
            const lComponentOne: HTMLElement = await <any>TestUtil.createComponent(TestComponentOne);
            const lRootValuesOne: LayerValues = ComponentConnection.componentManagerOf(lComponentOne).rootValues;
            const lComponentTwo: HTMLElement = await <any>TestUtil.createComponent(TestComponentTwo);
            const lRootValuesTwo: LayerValues = ComponentConnection.componentManagerOf(lComponentTwo).rootValues;

            // Process.
            const lIsEqual: boolean = lRootValuesOne.equal(lRootValuesTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Different temporary data', async () => {
            // Setup. Define component.
            @HtmlComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: LayerValues = ComponentConnection.componentManagerOf(lComponent).rootValues.rootValue;

            // Setup. Create child layer.
            const lChildLayerOne: LayerValues = new LayerValues(lRootValues);
            const lChildLayerTwo: LayerValues = new LayerValues(lRootValues);
            lChildLayerTwo.setLayerValue('Temporary-Key', 'Temporary-Value');

            // Process.
            const lIsEqual: boolean = lChildLayerOne.equal(lChildLayerTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Same keys, different temporary data value', async () => {
            // Setup. Define component.
            @HtmlComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: LayerValues = ComponentConnection.componentManagerOf(lComponent).rootValues.rootValue;

            // Setup. Create child layer.
            const lChildLayerOne: LayerValues = new LayerValues(lRootValues);
            lChildLayerOne.setLayerValue('Temporary-Key', 'Temporary-Value-One');
            const lChildLayerTwo: LayerValues = new LayerValues(lRootValues);
            lChildLayerTwo.setLayerValue('Temporary-Key', 'Temporary-Value-Two');

            // Process.
            const lIsEqual: boolean = lChildLayerOne.equal(lChildLayerTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });
    });

    describe('-- Get values', () => {
        it('-- From same layer', async () => {
            // Setup.
            const lLayerKey: string = 'LAYER-KEY';
            const lLayerValue: string = 'LAYER-VALUE';

            // Setup. Define component.
            @HtmlComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element and get root layer.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: LayerValues = ComponentConnection.componentManagerOf(lComponent).rootValues.rootValue;
            lRootValues.setLayerValue(lLayerKey, lLayerValue);

            // Process.
            const lResultValue: string = lRootValues.getValue(lLayerKey);

            // Evaluation.
            expect(lResultValue).to.equal(lLayerValue);
        });

        it('-- From parent layer', async () => {
            // Setup.
            const lLayerKey: string = 'LAYER-KEY';
            const lLayerValue: string = 'LAYER-VALUE';

            // Setup. Define component.
            @HtmlComponent({
                selector: TestUtil.randomSelector()
            })
            class TestComponent { }

            // Setup. Create element and get root layer.
            const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
            const lRootValues: LayerValues = ComponentConnection.componentManagerOf(lComponent).rootValues.rootValue;
            lRootValues.setLayerValue(lLayerKey, lLayerValue);

            // Setup. Create child layer.
            const lChildLayer: LayerValues = new LayerValues(lRootValues);

            // Process.
            const lResultValue: string = lChildLayer.getValue(lLayerKey);

            // Evaluation.
            expect(lResultValue).to.equal(lLayerValue);
        });
    });

    it('-- Remove value', async () => {
        // Setup.
        const lLayerKey: string = 'LAYER-KEY';
        const lLayerValue: string = 'LAYER-VALUE';

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Setup. Create element and get root layer.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lRootValues: LayerValues = ComponentConnection.componentManagerOf(lComponent).rootValues.rootValue;
        lRootValues.setLayerValue(lLayerKey, lLayerValue);

        // Process.
        lRootValues.removeLayerValue(lLayerKey);
        const lResultValue: string = lRootValues.getValue(lLayerKey);

        // Evaluation.
        expect(lResultValue).to.be.undefined;
    });

    it('-- Set root values', async () => {
        // Setup.
        const lLayerKey: string = 'LAYER-KEY';
        const lLayerValue: string = 'LAYER-VALUE';

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lRootValues: LayerValues = ComponentConnection.componentManagerOf(lComponent).rootValues.rootValue;

        // Setup. Create child layer.
        const lChildLayerOne: LayerValues = new LayerValues(lRootValues);
        const lChildLayerTwo: LayerValues = new LayerValues(lRootValues);

        // Process. Set root in child one and access in two.
        lChildLayerOne.setRootValue(lLayerKey, lLayerValue);
        const lResultValue: string = lChildLayerTwo.getValue(lLayerKey);

        // Evaluation.
        expect(lResultValue).to.equal(lLayerValue);
    });
});