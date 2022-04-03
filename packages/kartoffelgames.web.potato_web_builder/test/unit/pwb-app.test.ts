import { expect } from 'chai';
import { HtmlComponent } from '../../source/decorator/component/html-component';
import { PwbApp } from '../../source/pwb-app';
import '../mock/request-animation-frame-mock-session';
import '../utility/chai-helper';
import { TestUtil } from '../utility/test-util';

describe('PwbApp', () => {
    it('Property: content', () => {
        // Setup.
        const lApp: PwbApp = new PwbApp('Name');

        // Process.
        const lContent: Element = lApp.content;

        // Evaluation.
        expect(lContent.tagName.toLowerCase()).to.equal('div');
        expect(lContent.shadowRoot).to.be.not.null;
    });

    describe('Method: addContent', () => {
        it('-- Correct component', async () => {
            // Setup.
            const lApp: PwbApp = new PwbApp('Name');
            const lComponentSelector: string = TestUtil.randomSelector();

            // Setup. Define component.
            @HtmlComponent({
                selector: lComponentSelector,
                template: '<div/>'
            })
            class TestComponent { }

            // Process.
            lApp.addContent(TestComponent);
            const lContent: Element = <Element>lApp.content.shadowRoot.childNodes[0];

            // Evaluation.
            expect(lContent.tagName.toLowerCase()).to.equal(lComponentSelector);
        });

        it('-- Initialize component after appendTo', async () => {
            // Setup.
            const lApp: PwbApp = new PwbApp('Name');
            lApp.appendTo(document.body);

            // Setup. Define component.
            @HtmlComponent({
                selector: TestUtil.randomSelector(),
                template: '<div/>'
            })
            class TestComponent { }

            // Process.
            lApp.addContent(TestComponent);
            const lContent: HTMLElement & TestComponent = <any>lApp.content.shadowRoot.childNodes[0];
            await TestUtil.waitForUpdate(lContent);

            // Evaluation.
            expect(lContent).componentStructure([
                Comment,
                HTMLDivElement
            ], true);
        });

        it('-- Initialize component before appendTo', async () => {
            // Setup.
            const lApp: PwbApp = new PwbApp('Name');

            // Setup. Define component.
            @HtmlComponent({
                selector: TestUtil.randomSelector(),
                template: '<div/>'
            })
            class TestComponent { }

            // Process.
            lApp.addContent(TestComponent);
            lApp.appendTo(document.body);
            const lContent: HTMLElement & TestComponent = <any>lApp.content.shadowRoot.childNodes[0];
            await TestUtil.waitForUpdate(lContent);

            // Evaluation.
            expect(lContent).componentStructure([
                Comment,
                HTMLDivElement
            ], true);
        });

        it('-- Wrong component type', () => {
            // Setup.
            const lApp: PwbApp = new PwbApp('Name');

            // Process.
            const lErrorFunction = () => {
                lApp.addContent(class WhatEver { });
            };

            // Evaluation.
            expect(lErrorFunction).to.throw('Content is not a component.');
        });
    });

    it('Method: appendTo', () => {
        // Setup.
        const lDummyElement: HTMLDivElement = document.createElement('div');
        const lApp: PwbApp = new PwbApp('Name');

        // Process.
        lApp.appendTo(lDummyElement);

        // Evaluation.
        expect(lDummyElement.childNodes[0]).to.equal(lApp.content);
    });

    it('Method: addErrorListener', () => {
        // Setup.
        const lApp: PwbApp = new PwbApp('Name');

        // Process.
        lApp.addErrorListener(() => {/* */ });
        // TODO:
    });

    it('Method: addStyle', () => {
        // Setup.
        const lApp: PwbApp = new PwbApp('Name');
        const lStyleContent: string = 'Content';

        // Process.
        lApp.addStyle(lStyleContent);
        const lContent: HTMLStyleElement = <HTMLStyleElement>lApp.content.shadowRoot.childNodes[0];

        // Evaluation.
        expect(lContent instanceof HTMLStyleElement).to.be.true;
        expect(lContent.textContent).to.equal(lStyleContent);
    });
});