import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { expect } from 'chai';
import { HtmlComponent } from '../../../source/decorator/component/html-component';
import { Export, IdChild } from '../../../source/index';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/ChaiHelper';
import { TestUtil } from '../../utility/TestUtil';

describe('IdChildAttributeModule', () => {
    it('Read id child', async () => {
        // Setup. Values.
        const lIdName: string = 'IdChildId';

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div #${lIdName}/>`
        })
        class TestComponent {
            @Export
            @IdChild(lIdName)      
            public idChild: HTMLDivElement;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lComponentIdChild: HTMLDivElement = ChangeDetection.getUntrackedObject(lComponent.idChild);
        const lRealIdChild: HTMLDivElement = TestUtil.getComponentNode(lComponent, 'div');

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponentIdChild).to.equal(lRealIdChild);
    });
});