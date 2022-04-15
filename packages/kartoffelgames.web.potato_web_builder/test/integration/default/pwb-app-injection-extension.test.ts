import { expect } from 'chai';
import { PwbComponent } from '../../../source/component/decorator/pwb-component.decorator';
import { UpdateScope } from '../../../source/component/enum/update-scope';
import { PwbApp } from '../../../source/pwb-app';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('PwbAppInjectionExtension', () => {
    it('-- PwbApp injection on global element', async () => {
        // Process.
        let lApp: PwbApp;

        // Process. Define component.    
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            public constructor(pApp: PwbApp) {
                lApp = pApp;
            }
        }

        // Process. Create element and click div.
        await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lApp).to.be.instanceOf(PwbApp);
    });

    it('-- PwbApp injection on manual element', async () => {
        // Setup.
        const lCapsuledSelector: string = TestUtil.randomSelector();

        // Process.
        let lApp: PwbApp;

        // Setup. Define component.
        @PwbComponent({
            selector: lCapsuledSelector,
            updateScope: UpdateScope.Manual
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class CapsuledTestComponent {
            public constructor(pApp: PwbApp) {
                lApp = pApp;
            }
        }

        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lCapsuledSelector}/>`,
            updateScope: UpdateScope.Global
        })
        class TestComponent { }

        // Process. Create elements and wait for update.
        const lComponent: HTMLElement = await <any>TestUtil.createComponent(TestComponent);
        const lChildContent: HTMLElement = <any>lComponent.shadowRoot.childNodes[1];
        await TestUtil.waitForUpdate(lChildContent);

        // Evaluation.
        expect(lApp).to.be.instanceOf(PwbApp);
    });

    it('-- PwbApp injection on capsuled element', async () => {
        // Setup.
        const lCapsuledSelector: string = TestUtil.randomSelector();

        // Process.
        let lApp: PwbApp;

        // Setup. Define component.
        @PwbComponent({
            selector: lCapsuledSelector,
            updateScope: UpdateScope.Capsuled
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class CapsuledTestComponent {
            public constructor(pApp: PwbApp) {
                lApp = pApp;
            }
        }

        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lCapsuledSelector}/>`,
            updateScope: UpdateScope.Global
        })
        class TestComponent { }

        // Process. Create elements and wait for update.
        const lComponent: HTMLElement = await <any>TestUtil.createComponent(TestComponent);
        const lChildContent: HTMLElement = <any>lComponent.shadowRoot.childNodes[1];
        await TestUtil.waitForUpdate(lChildContent);

        // Evaluation.
        expect(lApp).to.be.instanceOf(PwbApp);
    });

    it('-- Deep nested manual component', async () => {
        // Setup.
        const lChildSelector: string = TestUtil.randomSelector();
        const lChildChildSelector: string = TestUtil.randomSelector();

        // Process.
        let lApp: PwbApp;

        // Setup. Define component.
        @PwbComponent({
            selector: lChildChildSelector,
            updateScope: UpdateScope.Manual
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class ChildChildTestComponent {
            public constructor(pApp: PwbApp) {
                lApp = pApp;
            }
        }

        // Setup. Define component.
        @PwbComponent({
            selector: lChildSelector,
            template: `<${lChildChildSelector}/>`,
            updateScope: UpdateScope.Capsuled
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class ChildTestComponent { }

        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lChildSelector}/>`,
            updateScope: UpdateScope.Global
        })
        class TestComponent { }

        // Process. Create elements and wait for update.
        const lComponent: HTMLElement = await <any>TestUtil.createComponent(TestComponent);
        const lChildContent: HTMLElement & ChildTestComponent = <any>lComponent.shadowRoot.childNodes[1];
        await TestUtil.waitForUpdate(lChildContent);
        const lChildChildContent: HTMLElement & ChildTestComponent = <any>lComponent.shadowRoot.childNodes[1];
        await TestUtil.waitForUpdate(lChildChildContent);

        // Evaluation.
        expect(lApp).to.be.instanceOf(PwbApp);
    });

    it('-- Creation without PwbApp', async () => {
        // Setup.
        const lSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector,
            template: '<div #child />'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestComponent {
            public constructor(_pApp: PwbApp) {/* Empty */ }
        }

        // Process. Create element.
        const lComponentConstructor: CustomElementConstructor = window.customElements.get(lSelector);
        
        // Process.
        let lMessage: string = null;
        try {
            const lComponent: HTMLElement = new lComponentConstructor();
            await TestUtil.waitForUpdate(lComponent);
        } catch (pException) {
            lMessage = pException.message;
        }

        // Evaluation.
        expect(lMessage).to.not.be.null;
    });
});