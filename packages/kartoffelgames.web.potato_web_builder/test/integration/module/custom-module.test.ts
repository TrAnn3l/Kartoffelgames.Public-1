import { expect } from 'chai';
import { HtmlComponent, IPwbMultiplicatorModuleOnUpdate, LayerValues, ManipulatorAttributeModule, ModuleAccessType, StaticAttributeModule, XmlElement } from '../../../source';
import { LayerValuesReference } from '../../../source/module/base/injection/layer-values-reference';
import { MultiplicatorResult } from '../../../source/module/base/result/multiplicator-result';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/ChaiHelper';
import { TestUtil } from '../../utility/TestUtil';

describe('Custom Module', () => {
    it('-- Same result, twice', async () => {
        // Setup. Define module.
        @ManipulatorAttributeModule({
            selector: /^\*multiresult$/
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule implements IPwbMultiplicatorModuleOnUpdate {
            private readonly mValueHandler: LayerValues;

            public constructor(pValueReference: LayerValuesReference) {
                this.mValueHandler = pValueReference.value;
            }

            public onUpdate(): MultiplicatorResult {
                // If in any way the execution result is true, add template to result.
                const lModuleResult: MultiplicatorResult = new MultiplicatorResult();
                lModuleResult.addElement(new XmlElement(), this.mValueHandler);
                lModuleResult.addElement(new XmlElement(), this.mValueHandler);

                return lModuleResult;
            }
        }

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *multiresult/>`
        })
        class TestComponent { }

        // Process. Create element.
        let lErrorMessage: string;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (e) {
            lErrorMessage = e.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal(`Can't add same template or value handler for multiple Elements.`);
    });

    it('-- Manupulator without update method', async () => {
        // Setup. Define module.
        @ManipulatorAttributeModule({
            selector: /^\*noupdatemethod$/
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule { }

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *noupdatemethod/>`
        })
        class TestComponent { }

        // Process. Create element.
        let lErrorMessage: string;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (e) {
            lErrorMessage = e.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal(`Multiplicator modules need to implement IPwbMultiplicatorModuleOnUpdate`);
    });

    it('-- Deconstruct module without deconstructor method', async () => {
        // Setup. Define module.
        @StaticAttributeModule({
            selector: /^nodeconstructmethod$/,
            forbiddenInManipulatorScopes: false,
            access: ModuleAccessType.Read
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class Module  {}

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div nodeconstructmethod/>`
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);
    });
});