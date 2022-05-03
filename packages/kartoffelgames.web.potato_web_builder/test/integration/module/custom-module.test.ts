import { XmlElement } from '@kartoffelgames/core.xml';
import { expect } from 'chai';
import { LayerValues } from '../../../source/component/values/layer-values';
import { PwbComponent } from '../../../source/component/decorator/pwb-component.decorator';
import { PwbMultiplicatorAttributeModule } from '../../../source/module/decorator/pwb-multiplicator-attribute-module.decorator';
import { PwbStaticAttributeModule } from '../../../source/module/decorator/pwb-static-attribute-module.decorator';
import { ModuleAccessType } from '../../../source/module/enum/module-access-type';
import { IPwbMultiplicatorModuleOnUpdate } from '../../../source/module/interface/module';
import { ModuleLayerValuesReference } from '../../../source/injection_reference/module-layer-values-reference';
import { MultiplicatorResult } from '../../../source/module/result/multiplicator-result';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('Custom Module', () => {
    it('-- Same result, twice', async () => {
        // Setup. Define module.
        @PwbMultiplicatorAttributeModule({
            selector: /^\*multiresult$/
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule implements IPwbMultiplicatorModuleOnUpdate {
            private readonly mValueHandler: LayerValues;

            public constructor(pValueReference: ModuleLayerValuesReference) {
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
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *multiresult/>`
        })
        class TestComponent { }

        // Process. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent, true);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal(`Can't add same template or value handler for multiple Elements.`);
    });

    it('-- Manupulator without update method', async () => {
        // Setup. Define module.
        @PwbMultiplicatorAttributeModule({
            selector: /^\*noupdatemethod$/
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule { }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *noupdatemethod/>`
        })
        class TestComponent { }

        // Process. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent, true);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal(`Multiplicator modules need to implement IPwbMultiplicatorModuleOnUpdate`);
    });

    it('-- Deconstruct module without deconstructor method', async () => {
        // Setup. Define module.
        @PwbStaticAttributeModule({
            selector: /^nodeconstructmethod$/,
            forbiddenInManipulatorScopes: false,
            access: ModuleAccessType.Read
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class Module { }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<div nodeconstructmethod/>`
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent: HTMLElement = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);
    });
});