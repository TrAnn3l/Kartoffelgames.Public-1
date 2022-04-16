import { Exception } from '@kartoffelgames/core.data';
import { expect } from 'chai';
import { PwbComponent } from '../../source/component/decorator/pwb-component.decorator';
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
            lApp.setSplashScreen({ content: '', background: '', manual: true, animationTime: 10 });
            const lComponentSelector: string = TestUtil.randomSelector();

            // Setup. Define component.
            @PwbComponent({
                selector: lComponentSelector,
                template: '<div/>'
            })
            class TestComponent { }

            // Process.
            lApp.addContent(TestComponent);
            await lApp.appendTo(document.body);
            const lContent: Element = <Element>lApp.content.shadowRoot.childNodes[1];

            // Evaluation.
            expect(lContent.tagName.toLowerCase()).to.equal(lComponentSelector);
        });

        it('-- Initialize component after appendTo', async () => {
            // Setup.
            const lApp: PwbApp = new PwbApp('Name');
            lApp.setSplashScreen({ content: '', background: '', manual: true, animationTime: 10 });
            await lApp.appendTo(document.body);

            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector(),
                template: '<div/>'
            })
            class TestComponent { }

            // Process.
            const lErrorFunction = () => {
                lApp.addContent(TestComponent);
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(Exception, 'App content is sealed after it got append to the DOM');
        });

        it('-- Initialize component before appendTo', async () => {
            // Setup.
            const lApp: PwbApp = new PwbApp('Name');
            lApp.setSplashScreen({ content: '', background: '', manual: true, animationTime: 10 });

            // Setup. Define component.
            @PwbComponent({
                selector: TestUtil.randomSelector(),
                template: '<div/>'
            })
            class TestComponent { }

            // Process.
            lApp.addContent(TestComponent);
            await lApp.appendTo(document.body);
            const lContent: HTMLElement & TestComponent = <any>lApp.content.shadowRoot.childNodes[1];
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

    describe('Method: appendTo', () => {
        it('-- Default', async () => {
            // Setup.
            const lDummyElement: HTMLDivElement = document.createElement('div');
            const lApp: PwbApp = new PwbApp('Name');
            lApp.setSplashScreen({ content: '', background: '', manual: true, animationTime: 10 });

            // Process.
            await lApp.appendTo(lDummyElement);

            // Evaluation.
            expect(lDummyElement.childNodes[0]).to.equal(lApp.content);
        });

        it('-- Remove splash screen', async () => {
            // Setup.
            const lDummyElement: HTMLDivElement = document.createElement('div');
            const lApp: PwbApp = new PwbApp('Name');
            lApp.setSplashScreen({ background: 'red', content: '', animationTime: 10 });

            // Process.
            await lApp.appendTo(lDummyElement);
            const lContent: ShadowRoot = lApp.content.shadowRoot;

            // Evaluation.
            expect(lContent.childNodes).to.have.lengthOf(0);
        });

        it('-- No double splash screen remove', async () => {
            // Setup. Create app.
            const lApp: PwbApp = new PwbApp('Name');
            const lContent: ShadowRoot = lApp.content.shadowRoot;

            // Process. Create splash screen.
            lApp.setSplashScreen({
                background: 'red',
                content: '',
                animationTime: 10
            });

            // Process. Append and wait for splash screen remove
            await lApp.appendTo(document.body);
            const lBeforeRemoveChildLength: number = lContent.childNodes.length;

            // Process
            await lApp.appendTo(document.body);
            const lAfterRemoveChildLength: number = lContent.childNodes.length;

            // Evaluation.
            expect(lBeforeRemoveChildLength).to.equal(0);
            expect(lAfterRemoveChildLength).to.equal(0);
        });
    });

    it('Method: addErrorListener', async () => {
        // Setup.
        const lErrorMessage: string = 'Custom Error';

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
        })
        class TestComponent {
            public constructor() {
                throw new Error(lErrorMessage);
            }
        }

        // Setup.
        const lApp: PwbApp = new PwbApp('Name');
        lApp.setSplashScreen({ content: '', background: '', manual: true, animationTime: 10 });
        lApp.addContent(TestComponent);

        // Process. Lof error.
        let lErrorMessageResult: string;
        lApp.addErrorListener((pError: Error) => {
            lErrorMessageResult = pError.message;
        });

        // Trow and catch error.
        try {
            await lApp.appendTo(document.body);
        } catch (pError) {
            window.dispatchEvent(new ErrorEvent('error', {
                error: pError,
                message: pError.message,
            }));
        }

        // Evaluation.
        expect(lErrorMessageResult).to.equal(lErrorMessage);
    });

    describe('Method: addStyle', () => {
        it('-- Default', () => {
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

        it('-- Add style after append', async () => {
            // Setup.
            const lApp: PwbApp = new PwbApp('Name');
            lApp.setSplashScreen({ content: '', background: '', manual: true, animationTime: 10 });
            await lApp.appendTo(document.body);

            // Process.
            const lErrorFunction = () => {
                lApp.addStyle('');
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(Exception, 'App content is sealed after it got append to the DOM');
        });
    });

    it('Method: removeSplashScreen', async () => {
        // Setup.
        const lApp: PwbApp = new PwbApp('Name');
        lApp.setSplashScreen({ background: 'red', content: '', animationTime: 10 });

        // Process
        await lApp.removeSplashScreen();
        const lContent: ShadowRoot = lApp.content.shadowRoot;

        // Evaluation.
        expect(lContent.childNodes).to.have.lengthOf(0);
    });

    describe('Method: setSplashScreen', () => {
        it('-- Default', () => {
            // Setup.
            const lBackground: string = 'red';
            const lContent: string = '<span style="color: #fff;">Anything</span>';

            // Setup. Create app.
            const lApp: PwbApp = new PwbApp('Name');

            // Process. Create splash screen.
            lApp.setSplashScreen({
                background: lBackground,
                content: lContent,
                animationTime: 10
            });

            // Process. Read splash screen data.
            const lSplashScreen: HTMLElement = <HTMLElement>lApp.content.shadowRoot.childNodes[0];
            const lContentWrapper: HTMLElement = <HTMLElement>lSplashScreen.childNodes[0];
            const lContentElement: HTMLElement = <HTMLElement>lContentWrapper.childNodes[0];
            const lContentString: string = lContentElement.innerHTML;

            expect(lContentWrapper.style.getPropertyValue('background')).to.equal(lBackground);
            expect(lContent).to.equal(lContentString);
        });

        it('-- Manual splash screen', async () => {
            // Setup. Create app.
            const lApp: PwbApp = new PwbApp('Name');
            const lContent: ShadowRoot = lApp.content.shadowRoot;

            // Process. Create splash screen.
            lApp.setSplashScreen({
                background: 'red',
                content: '',
                manual: true,
                animationTime: 10
            });

            // Process. Append and wait for splash screen remove
            await lApp.appendTo(document.body);
            const lBeforeRemoveChildLength: number = lContent.childNodes.length;

            // Process
            await lApp.removeSplashScreen();
            const lAfterRemoveChildLength: number = lContent.childNodes.length;

            // Evaluation.
            expect(lBeforeRemoveChildLength).to.equal(1);
            expect(lAfterRemoveChildLength).to.equal(0);
        });

        it('-- Add splashscreen after append', async () => {
            // Setup.
            const lApp: PwbApp = new PwbApp('Name');
            lApp.setSplashScreen({ background: 'red', content: '', animationTime: 10 });
            await lApp.appendTo(document.body);

            // Process.
            const lErrorFunction = () => {
                lApp.setSplashScreen({
                    background: 'red',
                    content: '',
                    animationTime: 10
                });
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(Exception, 'App content is sealed after it got append to the DOM');
        });
    });
});