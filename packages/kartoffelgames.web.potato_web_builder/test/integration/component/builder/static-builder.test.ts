import { expect } from 'chai';
import { HtmlComponent } from '../../../../source/decorator/component/html-component';
import '../../../mock/request-animation-frame-mock-session';
import '../../../utility/ChaiHelper';
import { TestUtil } from '../../../utility/TestUtil';

describe('PwbApp', () => {
    it('-- Multiple module update order', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div 
            expression="{{value}}"
            [write]="this.value"
            #read
            [(readwrite)]="this.value"
            expressionDouble="{{value}}"
            [writeDouble]="this.value"
            #readDouble
            [(readwriteDouble)]="this.value" />`
        })
        class TestComponent {
            public value: string = "";
        }

        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // TODO: Test update order?
    });

    it('-- Forbidden inside manipulator scope', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbIf="true">
                <div #child/>
            </div>`
        })
        class TestComponent {
            public value: string = "";
        }

        // Process.
        let lMessage: string = null;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch(pException){
            lMessage = pException.message;
        }

        // Evaluation.
        expect(lMessage).to.not.be.null;
    });
});