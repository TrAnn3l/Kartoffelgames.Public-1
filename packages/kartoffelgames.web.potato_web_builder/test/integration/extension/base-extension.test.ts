import { expect } from 'chai';
import { PwbComponent } from '../../../source/component/decorator/pwb-component.decorator';
import { PwbExtension } from '../../../source/extension/decorator/pwb-extension.decorator';
import { ExtensionMode } from '../../../source/extension/enum/extension-mode';
import { ExtensionType } from '../../../source/extension/enum/extension-type';
import { TestUtil } from '../../utility/test-util';

describe('BaseExtension', () => {
    it('-- Injection extension without injection', async () => {
        // Process. Create extension.
        let lExtensionCalled: boolean = false;
        @PwbExtension({
            type: ExtensionType.Component,
            mode: ExtensionMode.Inject
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class UselessExtension {
            public constructor() {
                lExtensionCalled = true;
            }
        }

        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent { }

        // Process. Create and initialize element.
        await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lExtensionCalled).to.be.true;
    });
});