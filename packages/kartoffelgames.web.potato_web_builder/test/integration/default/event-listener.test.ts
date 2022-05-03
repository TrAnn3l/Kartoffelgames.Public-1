import { Exception } from '@kartoffelgames/core.data';
import { expect } from 'chai';
import { PwbComponent } from '../../../source/component/decorator/pwb-component.decorator';
import { LayerValues } from '../../../source/component/values/layer-values';
import { ComponentEvent } from '../../../source/default/component-event/component-event';
import { ComponentEventEmitter } from '../../../source/default/component-event/component-event-emitter';
import { PwbComponentEvent } from '../../../source/default/component-event/pwb-component-event.decorator';
import { PwbEventListener } from '../../../source/default/event-listener/pwb-event-listener.decorator';
import { PwbExport } from '../../../source/default/export/pwb-export.decorator';
import { ModuleLayerValuesReference } from '../../../source/injection_reference/module-layer-values-reference';
import { ModuleTemplateReference } from '../../../source/injection_reference/module-template-reference';
import { PwbMultiplicatorAttributeModule } from '../../../source/module/decorator/pwb-multiplicator-attribute-module.decorator';
import { PwbStaticAttributeModule } from '../../../source/module/decorator/pwb-static-attribute-module.decorator';
import { ModuleAccessType } from '../../../source/module/enum/module-access-type';
import { IPwbMultiplicatorModuleOnUpdate } from '../../../source/module/interface/module';
import { MultiplicatorResult } from '../../../source/module/result/multiplicator-result';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('PwbEventListener', () => {
    it('-- Native listener', async () => {
        // Process.
        let lEventCalled: boolean = false;

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventCalled).to.be.true;
    });

    it('-- Custom event listener', async () => {
        // Setup.
        const lEventValue: string = 'EVENT-VALUE';

        // Process.
        let lEventValueResult: string = 'EVENT-VALUE';

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbComponentEvent('custom-event')
            private readonly mCustomEvent!: ComponentEventEmitter<string>;

            @PwbExport
            public callEvent() {
                this.mCustomEvent.dispatchEvent(lEventValue);
            }

            @PwbEventListener('custom-event')
            private listener(pEvent: ComponentEvent<string>) {
                lEventValueResult = pEvent.value;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.callEvent();

        // Evaluation.
        expect(lEventValueResult).to.equal(lEventValue);
    });

    it('-- Error on static properties', async () => {
        // Process.
        const lErrorFunction = () => {
            @PwbComponent({
                selector: TestUtil.randomSelector()
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestComponent {
                @PwbEventListener('click')
                private static listener(_pEvent: MouseEvent) {/* Empty */ }
            }
        };

        // Evaluation.
        expect(lErrorFunction).to.throw(Exception, 'Event listener is only valid on instanced property');
    });

    it('-- Error on none function properties', async () => {
        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbEventListener('click')
            private readonly mListener!: string;
        }

        // Setup. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal('Event listener property must be of type Function');
    });

    it('-- Two parallel listener', async () => {
        // Process.
        let lEventOneCalled: boolean = false;
        let lEventTwoCalled: boolean = false;

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbEventListener('click')
            private listenerOne(_pEvent: MouseEvent) {
                lEventOneCalled = true;
            }

            @PwbEventListener('click')
            private listenerTwo(_pEvent: MouseEvent) {
                lEventTwoCalled = true;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventOneCalled).to.be.true;
        expect(lEventTwoCalled).to.be.true;
    });

    it('-- Remove listener on deconstruct', async () => {
        // Process.
        let lEventCalled: boolean = false;

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            @PwbEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventCalled).to.be.false;
    });

    it('-- Native listener on static module', async () => {
        // Process.
        let lEventCalled: boolean = false;

        @PwbStaticAttributeModule({
            selector: /^listenerTestModuleOne$/,
            forbiddenInManipulatorScopes: false,
            access: ModuleAccessType.Read
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule {
            @PwbEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div listenerTestModuleOne />'
        })
        class TestComponent { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lDivElement: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');
        lDivElement.dispatchEvent(new Event('click', { bubbles: false }));

        // Evaluation.
        expect(lEventCalled).to.be.true;
    });

    it('-- Remove module listener on deconstruct on static modules', async () => {
        // Process.
        let lEventCalled: boolean = false;

        @PwbStaticAttributeModule({
            selector: /^listenerTestModuleTwo$/,
            forbiddenInManipulatorScopes: false,
            access: ModuleAccessType.Read
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule {
            @PwbEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div listenerTestModuleTwo />'
        })
        class TestComponent { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        TestUtil.deconstructComponent(lComponent);
        lComponent.click();

        // Evaluation.
        expect(lEventCalled).to.be.false;
    });

    it('-- Error on static properties on static module', async () => {
        // Setup. Create static module.
        @PwbStaticAttributeModule({
            selector: /^listenerTestModuleThree$/,
            forbiddenInManipulatorScopes: false,
            access: ModuleAccessType.Read
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule {
            @PwbEventListener('click')
            private readonly mListener!: string;
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div listenerTestModuleThree />'
        })
        class TestComponent { }

        // Setup. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal('Event listener property must be of type Function');
    });

    it('-- Use component element on multiplicator module', async () => {
        // Process.
        let lEventCalled: boolean = false;

        @PwbMultiplicatorAttributeModule({
            selector: /^\*listenerTestModuleFour$/
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class MyModule implements IPwbMultiplicatorModuleOnUpdate {
            public constructor(private readonly mTemplate: ModuleTemplateReference, private readonly mValue: ModuleLayerValuesReference) { }

            onUpdate(): MultiplicatorResult {
                const lResult: MultiplicatorResult = new MultiplicatorResult();
                lResult.addElement(this.mTemplate.value.clone(), new LayerValues(this.mValue.value));

                return lResult;
            }

            @PwbEventListener('click')
            private listener(_pEvent: MouseEvent) {
                lEventCalled = true;
            }
        }

        // Process. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: '<div *listenerTestModuleFour />'
        })
        class TestComponent { }

        // Process. Create element and click div.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lDivElement: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');

        // Evaluation after inner click..
        lDivElement.dispatchEvent(new Event('click', { bubbles: false }));
        expect(lEventCalled).to.be.false;

        // Evaluation after component click.
        lComponent.dispatchEvent(new Event('click', { bubbles: false }));
        expect(lEventCalled).to.be.true;
    });
});