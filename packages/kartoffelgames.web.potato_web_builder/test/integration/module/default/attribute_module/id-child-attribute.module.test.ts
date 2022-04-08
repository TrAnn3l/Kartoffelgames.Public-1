import { Exception } from '@kartoffelgames/core.data';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { expect } from 'chai';
import { Export } from '../../../../../source/default/export/export.decorator';
import { HtmlComponent } from '../../../../../source/component/decorator/html-component.decorator';
import { IdChild } from '../../../../../source/default/id_child/id-child';
import '../../../../mock/request-animation-frame-mock-session';
import '../../../../utility/chai-helper';
import { TestUtil } from '../../../../utility/test-util';

describe('IdChildAttributeModule', () => {
    it('-- Read id child', async () => {
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

    it('-- Forbidden static property use', () => {
        // Process.
        const lErrorFunction = () => {
            @HtmlComponent({
                selector: TestUtil.randomSelector()
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestComponent {
                @IdChild('Name')
                public static idChild: HTMLDivElement;
            }
        };

        // Evaluation.
        expect(lErrorFunction).to.throw(Exception, 'Event target is not for a static property.');
    });

    it('-- Read with wrong id child name', async () => {
        // Setup.
        const lWrongName: string = 'WrongName';

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div #Name/>`
        })
        class TestComponent {
            @Export
            @IdChild(lWrongName)
            public idChild: HTMLDivElement;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lErrorFunction = () => {
            lComponent.idChild;
        };

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lErrorFunction).to.throw(Exception, `Can't find IdChild "${lWrongName}".`);
    });
});