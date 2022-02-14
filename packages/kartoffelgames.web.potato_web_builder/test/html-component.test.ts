import { assert } from 'chai';
import { Injector, Metadata } from '@kartoffelgames/core.dependency-injection';
import { ComponentEventEmitter } from '../source/user_class_manager/component-event-emitter';
import { IPwbAfterInit, IPwbAfterUpdate, IPwbOnAttributeChange, IPwbOnDeconstruct, IPwbOnInit, IPwbOnUpdate } from '../source/interface/user-class';
import { UserObject } from '../source/interface/user-class';
import { PwbApp } from '../source/pwb-app';
import './mock/request-animation-frame-mock-session';
import { ComponentScopeExecutor } from '../source/module/execution/component-scope-executor';
import { MultiplicatorResult } from '../source/module/base/result/multiplicator-result';
import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { TemplateParser } from '../source/parser/template-parser';
import { XmlAttribute, XmlDocument, XmlElement } from '@kartoffelgames/core.xml';
import { LayerValues } from '../source/component/values/layer-values';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { ModuleAccessType } from '../source/enum/module-access-type';
import '../source/index';
import { WebsiteConfiguration } from './test_files/configuration/website-configuration';
import { ColorConfiguration } from './test_files/configuration/color-configuration';
import { UpdateScope } from '../source/enum/update-scope';
import { MetadataKey } from '../source/global-key';
import { LoopError } from '../source/component/handler/loop-detection-handler';
import { ComponentConnection } from '../source/component/component-connection';
import { HtmlComponent } from '../source/decorator/component/html-component';
import { Export } from '../source/decorator/component/export';
import { PwbElementReference } from '../source/component/injection/pwb-element-reference';
import { HtmlComponentEvent } from '../source/decorator/component/html-component-event';
import { IdChild } from '../source/decorator/component/id-child';
import { ManipulatorAttributeModule } from '../source/decorator/module/manipulator-attribute-module';
import { PwbUpdateReference } from '../source/index';
import { IPwbMultiplicatorModuleOnUpdate } from '../source/interface/module';

const gRandomSelector = (): string => {
    let lResult = '';
    const lCharacters = 'abcdefghijklmnopqrstuvwxyz';
    const lCharactersLength = lCharacters.length;
    for (let lIndex = 0; lIndex < 10; lIndex++) {
        lResult += lCharacters.charAt(Math.floor(Math.random() * lCharactersLength));
    }
    return `${lResult}-${lResult}`;
};

describe('HtmlComponent', () => {
    it('Basic none module usage', () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <div firstDivAttr="firstDivAttrText"/>
                <div secondDivAttr="SecondDivAttrText">
                    <span spanAttr="spanAttrText">Textdings</span>
                </div>
            `
        })
        class TestCustomElement {
            public testMethod() { return; }
        }

        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);

        assert.ok(lCustomElement instanceof Element);

        // Check first level childs.
        assert.equal(lCustomElement.shadowRoot.childNodes.length, 3);
        const lFirstRootChild: Comment = <Comment>lCustomElement.shadowRoot.childNodes[0];
        const lSecondRootChild: HTMLDivElement = <HTMLDivElement>lCustomElement.shadowRoot.childNodes[1];
        const lThirdRootChild: HTMLDivElement = <HTMLDivElement>lCustomElement.shadowRoot.childNodes[2];
        assert.ok(lFirstRootChild instanceof Comment, 'Is not a comment');
        assert.ok(lSecondRootChild instanceof HTMLDivElement, 'Is not a div');
        assert.ok(lThirdRootChild instanceof HTMLDivElement, 'Is also not a div');

        // First and second div attributes.
        assert.equal(lSecondRootChild.getAttribute('firstDivAttr'), 'firstDivAttrText');
        assert.equal(lThirdRootChild.getAttribute('secondDivAttr'), 'SecondDivAttrText');

        // Check span element
        assert.equal(lThirdRootChild.childNodes.length, 1);
        const lSpanElement: HTMLSpanElement = <HTMLSpanElement>lThirdRootChild.childNodes[0];
        assert.ok(lSpanElement instanceof HTMLSpanElement, 'Is not a span');
        assert.equal(lSpanElement.getAttribute('spanAttr'), 'spanAttrText');

        // Check third level child (Text).
        assert.equal(lSpanElement.childNodes.length, 1);
        const lTextNode: Text = <Text>lSpanElement.childNodes[0];
        assert.ok(lTextNode instanceof Text, 'Is not a text');
        assert.equal(lTextNode.textContent, 'Textdings');
    });

    it('Basic none module usage without app', (pDone: Mocha.Done) => {
        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <div firstDivAttr="firstDivAttrText"/>
                <div secondDivAttr="SecondDivAttrText">
                    <span spanAttr="spanAttrText">Textdings</span>
                </div>
            `
        })
        class TestCustomElement {
            public testMethod() { return; }
        }

        const lCustomElement: HTMLElement = <HTMLElement>new (window.customElements.get(<string>Metadata.get(TestCustomElement).getMetadata(MetadataKey.METADATA_SELECTOR)))();

        assert.ok(lCustomElement instanceof Element);

        // Check first level childs.
        assert.equal(lCustomElement.shadowRoot.childNodes.length, 3);
        const lFirstRootChild: Comment = <Comment>lCustomElement.shadowRoot.childNodes[0];
        const lSecondRootChild: HTMLDivElement = <HTMLDivElement>lCustomElement.shadowRoot.childNodes[1];
        const lThirdRootChild: HTMLDivElement = <HTMLDivElement>lCustomElement.shadowRoot.childNodes[2];
        assert.ok(lFirstRootChild instanceof Comment, 'Is not a comment');
        assert.ok(lSecondRootChild instanceof HTMLDivElement, 'Is not a div');
        assert.ok(lThirdRootChild instanceof HTMLDivElement, 'Is also not a div');

        // First and second div attributes.
        assert.equal(lSecondRootChild.getAttribute('firstDivAttr'), 'firstDivAttrText');
        assert.equal(lThirdRootChild.getAttribute('secondDivAttr'), 'SecondDivAttrText');

        // Check span element
        assert.equal(lThirdRootChild.childNodes.length, 1);
        const lSpanElement: HTMLSpanElement = <HTMLSpanElement>lThirdRootChild.childNodes[0];
        assert.ok(lSpanElement instanceof HTMLSpanElement, 'Is not a span');
        assert.equal(lSpanElement.getAttribute('spanAttr'), 'spanAttrText');

        // Check third level child (Text).
        assert.equal(lSpanElement.childNodes.length, 1);
        const lTextNode: Text = <Text>lSpanElement.childNodes[0];
        assert.ok(lTextNode instanceof Text, 'Is not a text');
        assert.equal(lTextNode.textContent, 'Textdings');
        pDone();
    });


    it('Basic Expression usage', (pDone: Mocha.Done) => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <div firstDivAttr="{{this.abcd}}">{{(this.abc.abcd - 1) + this.abcd + 'No'}}</div>
                <div firstDivAttr="firstDivAttrText"/>
                <div secondDivAttr="SecondDivAttrText">
                    <span spanAttr="spanAttrText">Textdings</span>
                </div>
            `
        })
        class TestCustomElement {
            public abc = { abcd: 12 };
            public abcd = 'Yes';
            public testMethod() { return; }
        }

        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);

        // Check first level childs.
        assert.equal(lCustomElement.shadowRoot.childNodes.length, 4);
        const lFirstRootChild: Comment = <Comment>lCustomElement.shadowRoot.childNodes[0];
        const lSecondRootChild: HTMLDivElement = <HTMLDivElement>lCustomElement.shadowRoot.childNodes[1];
        assert.ok(lFirstRootChild instanceof Comment, 'Is not a comment');
        assert.ok(lSecondRootChild instanceof HTMLDivElement, 'Is not a div');

        // First and second div attributes.
        assert.equal(lSecondRootChild.getAttribute('firstDivAttr'), 'Yes');

        // Check third level child (Text).
        assert.equal(lSecondRootChild.childNodes.length, 1);
        const lTextNode: Text = <Text>lSecondRootChild.childNodes[0];
        assert.ok(lTextNode instanceof Text, 'Is not a text');
        assert.equal(lTextNode.textContent, '11YesNo');
        pDone();
    });

    it('Module usage', () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <div *pwbFor="item of this.list">{{item}}</div>
                <span class="class1 {{this.attribute}}" *pwbIf="this.displayText">{{this.yayText}}</span>
                <span *pwbIf="!this.displayText">{{this.yayText2}}</span>
            `
        })
        class TestCustomElement {
            public attribute = 'ClassOderSo';
            public displayText = true;
            public list = [1, 2, 3, 4, 5];
            public yayText = 'Ja man es functioniert';
            public yayText2 = 'Oder auch nicht?!';
        }

        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);

        assert.equal(lCustomElement.shadowRoot.childNodes.length, 16);

        assert.equal(lCustomElement.shadowRoot.childNodes[3].childNodes[0].textContent, '1');
    });

    it('pwbFor index', () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <div *pwbFor="item of this.list; index = $index">{{item}} - {{index}}</div>
            `
        })
        class TestCustomElement {
            public list = [1, 2, 3, 4, 5, 'asdfghjk'];
        }

        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);

        assert.equal(lCustomElement.shadowRoot.childNodes[3].childNodes[0].textContent, '1 - 0');
        assert.equal(lCustomElement.shadowRoot.childNodes[5].childNodes[0].textContent, '2 - 1');
        assert.equal(lCustomElement.shadowRoot.childNodes[7].childNodes[0].textContent, '3 - 2');
        assert.equal(lCustomElement.shadowRoot.childNodes[9].childNodes[0].textContent, '4 - 3');
        assert.equal(lCustomElement.shadowRoot.childNodes[11].childNodes[0].textContent, '5 - 4');
        assert.equal(lCustomElement.shadowRoot.childNodes[13].childNodes[0].textContent, 'asdfghjk - 5');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <div *pwbFor="item of this.list; index = $index">{{item}} - {{index}}</div>
            `
        })
        class TestCustomElementTwo {
            public list = {
                '0': 1,
                '1': 2,
                '2': 3,
                '3': 4,
                '4': 5,
                'kdf': 'asdfghjk'
            };
        }

        const lCustomElementTwo: HTMLElement = lApp.addContent(TestCustomElementTwo);

        assert.equal(lCustomElementTwo.shadowRoot.childNodes[3].childNodes[0].textContent, '1 - 0');
        assert.equal(lCustomElementTwo.shadowRoot.childNodes[5].childNodes[0].textContent, '2 - 1');
        assert.equal(lCustomElementTwo.shadowRoot.childNodes[7].childNodes[0].textContent, '3 - 2');
        assert.equal(lCustomElementTwo.shadowRoot.childNodes[9].childNodes[0].textContent, '4 - 3');
        assert.equal(lCustomElementTwo.shadowRoot.childNodes[11].childNodes[0].textContent, '5 - 4');
        assert.equal(lCustomElementTwo.shadowRoot.childNodes[13].childNodes[0].textContent, 'asdfghjk - kdf');
    });

    it('Manipulator update', async () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <div (click)="" [something]="index" *pwbFor="item of this.list; index = $index">{{item}} - {{index}}</div>
            `
        })
        class MyComponent {
            public list = [1, 2, 3];
        }

        const lComponent: HTMLElement = lApp.addContent(MyComponent);
        const lUserClassObject: MyComponent = <any>ComponentConnection.componentManagerOf(lComponent).rootValues.componentManager.userObjectHandler.userObject;



        assert.equal(lComponent.shadowRoot.childNodes.length, 8);

        // Remove 3
        lUserClassObject.list.splice(2, 1);

        // Wait for updates.
        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();

        assert.equal(lComponent.shadowRoot.childNodes.length, 6);

        // Remove first
        lUserClassObject.list.shift();

        // Wait for updates.
        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();

        assert.equal(lComponent.shadowRoot.childNodes.length, 4);

        lUserClassObject.list.push(10);

        // Wait for updates.
        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();
        assert.equal(lComponent.shadowRoot.childNodes.length, 6);

        const lNewChild = lComponent.shadowRoot.childNodes[5];
        assert.ok(lNewChild instanceof HTMLDivElement);
        assert.ok(lNewChild.childNodes[0] instanceof Text);
        assert.equal((<Text>lNewChild.childNodes[0]).textContent, '10 - 1');

    });

    it('Manipulator inner component update', async () => {
        const lInnerComponent: string = gRandomSelector();

        @HtmlComponent({
            selector: lInnerComponent,
            template: `
                <div>{{this.index}} - {{this.item}} Text</div>
                <input [(value)]="this.text"/>
            `
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class Comp {
            @Export
            public index: any;
            @Export
            public item: any;
            @Export
            public text: string;
        }

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <${lInnerComponent} [(text)]="this.inputValue" [index]="MyIndex" [item]="item" *pwbFor="item of this.list; MyIndex = $index + 1"/>
                <input [(value)]="MyElement.value" />
                <input #MyElement [(value)]="this.inputValue" />
                <button (click)="this.newElement()">Kick mich {{this.list.length + 1}}te Element</button>
            `
        })
        class MyComponent {
            public readonly updater: PwbUpdateReference;
            public inputValue: string;
            public list = ['a', 'b', 'c'];

            public constructor(pElement: PwbUpdateReference, pApp: PwbApp) {
                this.inputValue = 'Starting input value';
                this.updater = pElement;
            }

            public newElement() {
                this.list.push('NewElement');
                this.updater.update();
            }
        }

        const lApp = new PwbApp('AppName');

        const lComponent: HTMLElement = lApp.addContent(MyComponent);

        assert.equal(lComponent.shadowRoot.childNodes.length, 11);
        // Check first manipulator element
        const lFirstManipulatorElement = <HTMLElement>lComponent.shadowRoot.childNodes[3];

        // Wait for updates of inner object.
        await ComponentConnection.componentManagerOf(lFirstManipulatorElement).updateHandler.waitForUpdate();

        assert.ok(lFirstManipulatorElement instanceof HTMLElement);
        assert.ok(lFirstManipulatorElement.shadowRoot.childNodes[1] instanceof HTMLDivElement);
        assert.ok(lFirstManipulatorElement.shadowRoot.childNodes[2] instanceof HTMLInputElement);
        assert.equal(lFirstManipulatorElement.shadowRoot.childNodes[1].childNodes[0].textContent, '1 - a Text');
        assert.equal((<HTMLInputElement>lFirstManipulatorElement.shadowRoot.childNodes[2]).value, 'Starting input value');

        const lButton: HTMLButtonElement = <HTMLButtonElement>lComponent.shadowRoot.childNodes[10];
        assert.ok(lButton instanceof HTMLButtonElement);
        lButton.click();

        // Wait for outer component update.
        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();

        assert.equal(lComponent.shadowRoot.childNodes.length, 13);

        // Check first manipulator element
        const lNewManipulatorElement = <HTMLElement>lComponent.shadowRoot.childNodes[9];

        // Wait for updates of inner object.
        await ComponentConnection.componentManagerOf(lNewManipulatorElement).updateHandler.waitForUpdate();

        assert.ok(lNewManipulatorElement instanceof HTMLElement);
        assert.ok(lNewManipulatorElement.shadowRoot.childNodes[1] instanceof HTMLDivElement);
        assert.ok(lNewManipulatorElement.shadowRoot.childNodes[2] instanceof HTMLInputElement);
        assert.equal(lNewManipulatorElement.shadowRoot.childNodes[1].childNodes[0].textContent, '4 - NewElement Text');
        assert.equal((<HTMLInputElement>lNewManipulatorElement.shadowRoot.childNodes[2]).value, 'Starting input value');

        // Update by value
        (<any>ComponentConnection.componentManagerOf(lComponent).userObjectHandler.userObject).inputValue = 'NewValue';

        // Wait for outer component update.
        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();

        // Wait for updates of inner object.
        await ComponentConnection.componentManagerOf(lNewManipulatorElement).updateHandler.waitForUpdate();

        // Wait for outer component update.
        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();
        await ComponentConnection.componentManagerOf(lNewManipulatorElement).updateHandler.waitForUpdate();

        assert.ok(lNewManipulatorElement instanceof HTMLElement);
        assert.ok(lNewManipulatorElement.shadowRoot.childNodes[1] instanceof HTMLDivElement);
        assert.ok(lNewManipulatorElement.shadowRoot.childNodes[2] instanceof HTMLInputElement);
        assert.equal(lNewManipulatorElement.shadowRoot.childNodes[1].childNodes[0].textContent, '4 - NewElement Text');
        assert.equal((<HTMLInputElement>lNewManipulatorElement.shadowRoot.childNodes[2]).value, 'NewValue');
    });

    it('Static update', async () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <div class="{{this.text2}}">{{this.text}}</div>
                <button (click)="this.fn()">Click ME</button>
            `
        })
        class MyComponent {
            public text = 'abc';
            public text2 = 'abc2';
            public fn() {
                this.text = 'NewAbc';
            }
        }

        const lComponent: HTMLElement = lApp.addContent(MyComponent);
        const lUserClassObject: MyComponent = <any>ComponentConnection.componentManagerOf(lComponent).rootValues.componentManager.userObjectHandler.userObject;
        lUserClassObject.text = 'cba';
        lUserClassObject.text2 = '2cba';

        // Wait for update
        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();
        assert.equal((<Element>lComponent.shadowRoot.childNodes[1]).getAttribute('class'), '2cba');
        assert.equal(lComponent.shadowRoot.childNodes[1].childNodes[0].textContent, 'cba');

        (<HTMLElement>lComponent.shadowRoot.childNodes[2]).click();
        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();
        assert.equal(lComponent.shadowRoot.childNodes[1].childNodes[0].textContent, 'NewAbc');
    });

    it('Use this in function calls', () => {
        const lApp = new PwbApp('MyApp');
        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <div>{{this.fn()}}</div>
            `
        })
        class MyComponent {
            public text = 'abc';
            public fn() {
                assert.equal(this.text, 'abc');
                return this;
            }
        }

        lApp.addContent(MyComponent);
    });

    it('TwoWayBinding', async () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <div>{{this.myText}}</div>
                <input [(value)]="this.myText" />
            `
        })
        class MyComponent {
            public myText: string;
        }

        const lComponent: HTMLElement = lApp.addContent(MyComponent);
        const lUserClassObject: MyComponent = <any>ComponentConnection.componentManagerOf(lComponent).rootValues.componentManager.userObjectHandler.userObject;

        assert.ok(lComponent.shadowRoot.childNodes[0] instanceof Comment);
        assert.ok(lComponent.shadowRoot.childNodes[1] instanceof HTMLDivElement);
        assert.ok(lComponent.shadowRoot.childNodes[2] instanceof HTMLInputElement);
        assert.equal(lComponent.shadowRoot.childNodes[1].childNodes[0].textContent, 'undefined');
        assert.equal((<HTMLInputElement>lComponent.shadowRoot.childNodes[2]).value, '');

        // Change value by "typing".
        const lInputElement: HTMLInputElement = (<HTMLInputElement>lComponent.shadowRoot.childNodes[2]);
        lInputElement.value = 'MyNewValue';
        const lInputEvent: Event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        lInputElement.dispatchEvent(lInputEvent);

        // Wait for update
        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();
        assert.equal(lComponent.shadowRoot.childNodes[1].childNodes[0].textContent, 'MyNewValue');
        assert.equal((<HTMLInputElement>lComponent.shadowRoot.childNodes[2]).value, 'MyNewValue');

        // Change value by clanging user class object.
        lUserClassObject.myText = 'MyNewerValue';

        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();
        assert.equal(lComponent.shadowRoot.childNodes[1].childNodes[0].textContent, 'MyNewerValue');
        assert.equal((<HTMLInputElement>lComponent.shadowRoot.childNodes[2]).value, 'MyNewerValue');
    });

    it('Content Root', () => {
        const lApp = new PwbApp('MyApp');
        const lTestComponentShadowRoot: string = gRandomSelector();

        @HtmlComponent({
            selector: lTestComponentShadowRoot,
            template: `
                <div $MyShadowRoot></div>
            `,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestComponentClassShadowRoot { }

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <${lTestComponentShadowRoot}>
                    <span>SuperElement</span>
                    PureText
                </${lTestComponentShadowRoot}>
            `,
        })
        class TestCustomElement { }

        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);

        assert.ok(lCustomElement instanceof Element);

        // Check first level childs.
        assert.equal(lCustomElement.shadowRoot.childNodes.length, 2);
        const lFirstRootChild: Comment = <Comment>lCustomElement.shadowRoot.childNodes[0];
        const lSecondRootChild: Element = <Element>lCustomElement.shadowRoot.childNodes[1];
        assert.ok(lFirstRootChild instanceof Comment, 'Is not a comment');
        assert.equal(lSecondRootChild.tagName.toLocaleLowerCase(), lTestComponentShadowRoot.toLocaleLowerCase(), 'Is not a component');

        // Check slot content.
        assert.equal(lSecondRootChild.shadowRoot.childNodes.length, 4);
        assert.ok(lSecondRootChild.shadowRoot.childNodes[0] instanceof Comment);
        assert.ok(lSecondRootChild.shadowRoot.childNodes[1] instanceof Comment);
        assert.ok(lSecondRootChild.shadowRoot.childNodes[2] instanceof Comment);
        assert.ok(lSecondRootChild.shadowRoot.childNodes[3] instanceof HTMLDivElement);

        // Check if div has slot.
        assert.equal(lSecondRootChild.shadowRoot.childNodes[3].childNodes.length, 1); // One slot element.
        assert.equal((<Element>lSecondRootChild.shadowRoot.childNodes[3].childNodes[0]).tagName.toLowerCase(), 'slot');

        // Check if slot element has assigned span node.
        const lSlotElement: HTMLSlotElement = <HTMLSlotElement>lSecondRootChild.shadowRoot.childNodes[3].childNodes[0];
        assert.equal(lSlotElement.assignedNodes().length, 2);
        assert.ok(lSlotElement.assignedNodes()[0] instanceof HTMLSpanElement);
        assert.equal(lSlotElement.assignedNodes()[0].textContent, 'SuperElement');
        assert.ok(lSlotElement.assignedNodes()[1] instanceof HTMLSpanElement);
        assert.equal(lSlotElement.assignedNodes()[1].textContent.trim(), 'PureText');

        const lSlotSpanElement: HTMLSpanElement = <HTMLSpanElement>lSlotElement.assignedNodes()[0];
        const lSecondSpanElement: HTMLSpanElement = <HTMLSpanElement>lSlotElement.assignedNodes()[1];

        // Check if span element is also append to root element.
        assert.equal(lSecondRootChild.childNodes.length, 2);
        assert.ok(lSecondRootChild.childNodes[0] instanceof HTMLSpanElement);
        assert.equal(lSecondRootChild.childNodes[0].textContent, 'SuperElement');
        assert.equal((<Element>lSecondRootChild.childNodes[0]).getAttribute('slot'), 'MyShadowRoot');
        assert.equal(lSecondRootChild.childNodes[0], lSlotSpanElement);

        assert.ok(lSecondRootChild.childNodes[1] instanceof HTMLSpanElement);
        assert.equal(lSecondRootChild.childNodes[1].textContent.trim(), 'PureText');
        assert.equal((<Element>lSecondRootChild.childNodes[1]).getAttribute('slot'), 'MyShadowRoot');
        assert.equal(lSecondRootChild.childNodes[1], lSecondSpanElement);
    });

    it('Injection', () => {
        const lApp = new PwbApp('MyApp');

        @Injector.Injectable
        class InjectableParameter {
            public value: number = 123;
        }

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `{{this.parameter.value}}`,
        })
        class TestCustomElement {
            constructor(public parameter: InjectableParameter) { }
        }

        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);

        assert.ok(lCustomElement instanceof Element);

        // Check first level childs.
        assert.equal(lCustomElement.shadowRoot.childNodes.length, 2);
        const lFirstRootChild: Comment = <Comment>lCustomElement.shadowRoot.childNodes[0];
        const lSecondRootChild: Text = <Text>lCustomElement.shadowRoot.childNodes[1];
        assert.ok(lFirstRootChild instanceof Comment, 'Is not a comment');
        assert.ok(lSecondRootChild instanceof Text, 'Is not a text');
        assert.equal(lSecondRootChild.textContent, '123');
    });

    it('Event emitter', (pDone: Mocha.Done) => {
        const lApp = new PwbApp('MyApp');

        const lEventComponent: string = gRandomSelector();

        let lTriggerEvent: () => void;

        @HtmlComponent({
            selector: lEventComponent
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestEventCustomElement implements IPwbOnInit {
            @HtmlComponentEvent('TimedEvent')
            public mTimedEvent: ComponentEventEmitter<number> = new ComponentEventEmitter();

            onPwbInitialize(): void {
                lTriggerEvent = (): void => {
                    this.mTimedEvent.dispatchEvent(123);
                };
            }
        }

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `<${lEventComponent} (TimedEvent)="this.event($event)" ></${lEventComponent}>`,
        })
        class TestCustomElement {
            public event(pNumber: number): void {
                assert.equal(pNumber, 123);
                pDone();
            }
        }

        const lCustomElement: Element = lApp.addContent(TestCustomElement);

        assert.equal(lCustomElement.shadowRoot.childNodes.length, 2);
        const lFirstRootChild: Comment = <Comment>lCustomElement.shadowRoot.childNodes[0];
        const lSecondRootChild: Element = <Element>lCustomElement.shadowRoot.childNodes[1];
        assert.ok(lFirstRootChild instanceof Comment, 'Is not a comment');
        assert.equal(lSecondRootChild.tagName.toLocaleLowerCase(), lEventComponent.toLocaleLowerCase(), 'Is not a component');

        // Trigger event.
        lTriggerEvent();
    });

    it('Namespaced SVG', () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <s:svg xmlns:s="http://www.w3.org/2000/svg" viewBox="{{this.startX}} {{this.startY}} {{this.endX}} {{this.endY}}">
                    <s:g *pwbFor="path of this.paths"><s:path d="{{this.path}}"/></s:g>
                    <s:polygon *pwbFor="point of this.polygons" d="{{this.point}}"/>
                    <s:polyline *pwbFor="point of this.polyline" d="{{this.point}}"/>       
                </s:svg>
            `
        })
        class TestCustomElement {
            public endX: number = 24;
            public endY: number = 24;
            public paths: Array<string> = ['MyPath'];
            public polygons: Array<string>;
            public polyline: Array<string>;
            public startX: number = 0;
            public startY: number = 0;
        }

        const lCustomElement: Element = lApp.addContent(TestCustomElement);

        assert.equal(lCustomElement.shadowRoot.childNodes.length, 2);
        const lFirstRootChild: Comment = <Comment>lCustomElement.shadowRoot.childNodes[0];
        const lSecondRootChild: Element = <Element>lCustomElement.shadowRoot.childNodes[1];
        assert.ok(lFirstRootChild instanceof Comment, 'Is not a comment');
        assert.ok(lSecondRootChild instanceof Element, 'Is not a svg element');
        assert.equal(lSecondRootChild.tagName, 'svg');
        assert.equal(lSecondRootChild.namespaceURI, 'http://www.w3.org/2000/svg');
        assert.equal(lSecondRootChild.getAttribute('viewBox'), '0 0 24 24');
    });

    it('IdChild decorator', (pDone: Mocha.Done) => {
        const lApp = new PwbApp('MyApp');
        let lDoneCalled: boolean = false;

        const lSecondComponent: string = gRandomSelector();

        @HtmlComponent({
            selector: lSecondComponent
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class SecondComponent {
        }

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <input #MyIdChild/>
                <${lSecondComponent} #MyIdChildTwo />
                <div>{{this.fn()}}</div>
            `
        })
        class MyComponent {
            @IdChild('MyIdChild')
            private readonly mMyIdChild: HTMLElement;

            @IdChild('MyIdChildTwo')
            private readonly mMyIdChildTwo: UserObject;

            public fn() {
                assert.ok(this.mMyIdChild instanceof HTMLInputElement);
                assert.ok('componentHandler' in this.mMyIdChildTwo);
                if (!lDoneCalled) {
                    lDoneCalled = true;
                    pDone();
                }

                return '';
            }
        }

        lApp.addContent(MyComponent);
    });

    it('Export decorator', () => {
        const lApp = new PwbApp('MyApp');
        const lSecondComponent: string = gRandomSelector();

        @HtmlComponent({
            selector: lSecondComponent,
            template: `<div></div>`
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class SecondComponent {
            @Export
            public index: number;
            @Export
            public item: any;
        }

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <${lSecondComponent} [item]="item" [index]="index" *pwbFor="item of this.list; index = $index"></${lSecondComponent}>
            `
        })
        class MyComponent {
            public list = ['a', 'b', 'c'];
        }

        const lCustomElement: HTMLElement = lApp.addContent(MyComponent);

        assert.equal(lCustomElement.shadowRoot.childNodes.length, 8);
    });

    it('Export decorator fail', () => {
        assert.throws(() => {
            @HtmlComponent({
                selector: gRandomSelector(),
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class SecondComponent {
                @Export
                public static index: number;
            }
        });
    });

    it('Svg elements', () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <svg viewBox="0 0 300 100">
                    <circle cx="50" cy="50" r="40" stroke="red" fill="grey" />
                    <circle cx="150" cy="50" r="4" stroke="red" fill="grey" />

                    <svg viewBox="0 0 10 10" x="200" width="100">
                        <circle cx="5" cy="5" r="4" stroke="red" fill="grey" />
                    </svg>
                </svg>
            `
        })
        class TestCustomElement {
            public testMethod() { return; }
        }

        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);

        assert.ok(lCustomElement instanceof Element);
        assert.ok(lCustomElement.shadowRoot.childNodes[0] instanceof Comment);
        assert.equal((<Element>lCustomElement.shadowRoot.childNodes[1]).tagName, 'svg');
        assert.equal((<Element>lCustomElement.shadowRoot.childNodes[1]).namespaceURI, 'http://www.w3.org/2000/svg');

        // svg inner
        const lSvgElement: SVGSVGElement = <SVGSVGElement>lCustomElement.shadowRoot.childNodes[1];
        assert.equal((<Element>lSvgElement.childNodes[0]).tagName, 'circle');
        assert.equal((<Element>lSvgElement.childNodes[0]).namespaceURI, 'http://www.w3.org/2000/svg');
        assert.equal((<Element>lSvgElement.childNodes[1]).tagName, 'circle');
        assert.equal((<Element>lSvgElement.childNodes[1]).namespaceURI, 'http://www.w3.org/2000/svg');
        assert.equal((<Element>lSvgElement.childNodes[2]).tagName, 'svg');
        assert.equal((<Element>lSvgElement.childNodes[2]).namespaceURI, 'http://www.w3.org/2000/svg');

        // svg inner inner
        const lInnerSvgElement: SVGSVGElement = <SVGSVGElement>lSvgElement.childNodes[2];
        assert.equal((<Element>lInnerSvgElement.childNodes[0]).tagName, 'circle');
        assert.equal((<Element>lInnerSvgElement.childNodes[0]).namespaceURI, 'http://www.w3.org/2000/svg');
    });

    it('Set exported attribute', async () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: '{{this.placeholder}}'
        })
        class TestCustomElement {
            @Export placeholder: string;
        }

        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);

        lCustomElement.setAttribute('placeholder', 'test123');

        // Wait for update
        await ComponentConnection.componentManagerOf(lCustomElement).updateHandler.waitForUpdate();

        assert.equal((<any>ComponentConnection.componentManagerOf(lCustomElement).userObjectHandler.userObject)['placeholder'], 'test123');
        assert.equal(lCustomElement.getAttribute('placeholder'), 'test123');
        assert.ok(lCustomElement.shadowRoot.childNodes[1] instanceof Text);
        assert.equal((<Text>lCustomElement.shadowRoot.childNodes[1]).nodeValue, 'test123');
    });

    it('Additional Module', async () => {
        @ManipulatorAttributeModule({
            accessType: ModuleAccessType.Read,
            attributeSelector: /^\*pwbDynamicContent$/,
            forbiddenInManipulatorScopes: false,
            manipulatesAttributes: false
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class DynamicContent {
            private readonly mAttribute: XmlAttribute;
            private mLastValue: string;
            private readonly mTargetTemplate: XmlElement;
            private readonly mValueHandler: LayerValues;

            /**
             * Constructor.
             * @param pTargetTemplate - Target templat.
             * @param pValueHandler - Values of component.
             * @param pAttribute - Attribute of module.
             */
            public constructor(pTargetTemplate: XmlElement, pValueHandler: LayerValues, pAttribute: XmlAttribute) {
                this.mTargetTemplate = pTargetTemplate;
                this.mValueHandler = pValueHandler;
                this.mAttribute = pAttribute;
            }

            protected onProcess(): MultiplicatorResult {
                const lResult: any = ComponentScopeExecutor.executeSilent(this.mAttribute.value, this.mValueHandler);
                this.mLastValue = lResult;

                // Validate result.
                if (typeof lResult !== 'string') {
                    throw new Exception('Dynamic content need to be a xml string', this);
                }

                const lDynamicContentNodes: XmlDocument = new TemplateParser().parse(lResult);

                // Clone node and add parsed content.
                const lNewNode: XmlElement = <XmlElement>this.mTargetTemplate.clone();
                lNewNode.appendChild(...lDynamicContentNodes.body);

                const lModuleResult: MultiplicatorResult = new MultiplicatorResult();
                lModuleResult.addElement(lNewNode, new LayerValues(this.mValueHandler));

                return lModuleResult;
            }

            protected onUpdate(): boolean {
                return ComponentScopeExecutor.executeSilent(this.mAttribute.value, this.mValueHandler) !== this.mLastValue;
            }
        }

        @HtmlComponent({
            selector: 'pwb-dialog',
            template: `<div class="Dialog">
                            <div class="DialogHead"></div>
                            <div class="DialogBody" *pwbDynamicContent="this.getBody()"></div>
                        </div>`
        })
        class PwbDialogComponent {
            @Export dialogComponentName: string;
            @Export dialogData: Dictionary<string, any>;

            private readonly mElement: HTMLElement & HTMLElement;

            public constructor(pElement: PwbElementReference) {
                this.mElement = <any>pElement.element;
            }

            @Export close = (): void => {
                this.mElement.remove();
                ComponentConnection.componentManagerOf(this.mElement).deconstruct();
            };

            public getBody(): string {
                // Default => empty body.
                let lBodyXmlString: string = '';

                // Construct xml string with dialogComponentName as tagname and data attributes.
                if (typeof this.dialogComponentName === 'string' && this.dialogComponentName.trim() !== '') {
                    // Create all data attributes.
                    const lDataAttributeList: Array<string> = new Array<string>();
                    if (this.dialogData) {
                        for (const lDataKey of this.dialogData.keys()) {
                            lDataAttributeList.push(`[${lDataKey}]="this.dialogData.get('${lDataKey}')"`);
                        }
                    }

                    lBodyXmlString = `<${this.dialogComponentName} ${lDataAttributeList.join(' ')}/>`;
                }

                return lBodyXmlString;
            }
        }

        const lSelectorName: string = gRandomSelector();
        @HtmlComponent({
            selector: lSelectorName,
            template: '{{this.placeholder}}'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestCustomElement {
            @Export placeholder: string;
        }

        // Create dialog component.
        const lDialogData = new Dictionary<string, any>();
        //lDialogData.add('placeholder', 'MyPlaceholder');
        const lDialogComponent: HTMLElement & PwbDialogComponent = <any>new (window.customElements.get(<string>Metadata.get(PwbDialogComponent).getMetadata(MetadataKey.METADATA_SELECTOR)))();
        lDialogComponent.dialogComponentName = lSelectorName;
        lDialogComponent.dialogData = lDialogData;

        // Wait for current updates.
        await ComponentConnection.componentManagerOf(lDialogComponent).updateHandler.waitForUpdate();
        await ComponentConnection.componentManagerOf(lDialogComponent).updateHandler.waitForUpdate();
    });

    it('Correct Zone in constructor', (pDone: Mocha.Done) => {
        const lFirstSelectorElement = gRandomSelector();
        const lSecondSelectorElement = gRandomSelector();

        @HtmlComponent({
            selector: lFirstSelectorElement,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestCustomElement1 {
            constructor(pElement: PwbElementReference) {
                assert.equal(ChangeDetection.current.name.toLowerCase(), 'myapp');
                pDone();
            }
        }

        @HtmlComponent({
            selector: lSecondSelectorElement,
            template: `<${lFirstSelectorElement} />`
        })
        class TestCustomElement2 {
        }

        const lApp = new PwbApp('MyApp');
        lApp.addContent(TestCustomElement2);

    });

    it('Content Root manipulator add', () => {
        const lApp = new PwbApp('MyApp');
        const lTestComponentShadowRoot: string = gRandomSelector();

        @HtmlComponent({
            selector: lTestComponentShadowRoot,
            template: `
                <div $MyShadowRoot></div>
            `,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestComponentClassShadowRoot { }

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <${lTestComponentShadowRoot}>
                    <span *pwbFor="item of this.list">{{item}}</span>
                </${lTestComponentShadowRoot}>
            `,
        })
        class TestCustomElement {
            list = [1, 2, 3, 4];
        }

        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);

        assert.ok(lCustomElement instanceof Element);

        // Check first level childs.
        assert.equal(lCustomElement.shadowRoot.childNodes.length, 2);
        const lFirstRootChild: Comment = <Comment>lCustomElement.shadowRoot.childNodes[0];
        const lSecondRootChild: Element = <Element>lCustomElement.shadowRoot.childNodes[1];
        assert.ok(lFirstRootChild instanceof Comment, 'Is not a comment');
        assert.equal(lSecondRootChild.tagName.toLocaleLowerCase(), lTestComponentShadowRoot.toLocaleLowerCase(), 'Is not a component');

        // Check slot content.
        assert.equal(lSecondRootChild.shadowRoot.childNodes.length, 4);
        assert.ok(lSecondRootChild.shadowRoot.childNodes[0] instanceof Comment);
        assert.ok(lSecondRootChild.shadowRoot.childNodes[1] instanceof Comment);
        assert.ok(lSecondRootChild.shadowRoot.childNodes[2] instanceof Comment);
        assert.ok(lSecondRootChild.shadowRoot.childNodes[3] instanceof HTMLDivElement);

        // Check if div has slot.
        assert.equal(lSecondRootChild.shadowRoot.childNodes[3].childNodes.length, 1); // One slot element.
        assert.equal((<Element>lSecondRootChild.shadowRoot.childNodes[3].childNodes[0]).tagName.toLowerCase(), 'slot');

        assert.equal(lSecondRootChild.childNodes.length, 9);

        // Check if slot element has assigned span node.
        const lSlotElement: HTMLSlotElement = <HTMLSlotElement>lSecondRootChild.shadowRoot.childNodes[3].childNodes[0];
        assert.equal(lSlotElement.assignedNodes().length, 4);

        // Check all childs.
        for (let lIndex = 0; lIndex < lSlotElement.assignedNodes().length; lIndex++) {
            assert.ok(lSlotElement.assignedNodes()[lIndex] instanceof HTMLSpanElement);
            assert.equal(lSlotElement.assignedNodes()[lIndex].textContent, (lIndex + 1).toString());
        }
    });

    it('PwbOnAttributeChange', (pDone: Mocha.Done) => {
        const lApp = new PwbApp('MyApp');
        const lTestComponentShadowRoot: string = gRandomSelector();

        @HtmlComponent({
            selector: 'login-head-control',
            template: `<pwb-icon-button class="userInteraction">
                            <pwb-user-icon />
                        </pwb-icon-button>
                        <pwb-button class="loginButton" slot="end" >Login</pwb-button>`
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class LoginControl { }

        @HtmlComponent({
            selector: 'user-page',
            template: 'USER PAGE!!!'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class UserPage { }

        @HtmlComponent({
            selector: 'home-page',
            template: 'HOME PAGE!!!'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class HomePage { }

        @HtmlComponent({
            selector: 'not-found-page',
            template: '404 PAGE!!!'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class NotFoundPage { }

        const lColors: ColorConfiguration = {
            /* Primary */
            colorPrimary: '#000',
            colorPrimaryContrast: '#fff',
            colorPrimaryShade: '#000',
            colorPrimaryTint: '#1a1a1a',
            /* Secondary */
            colorSecondary: '#161617',
            colorSecondaryContrast: '#ddd',
            colorSecondaryShade: '#121212',
            colorSecondaryTint: '#2d2d2e',
            /* Color Tertiary */
            colorTertiary: '#004887',
            colorTertiaryContrast: '#ddd',
            colorTertiaryShade: '#013a6d',
            colorTertiaryTint: '#025aa7',
            /* Color Accent */
            colorAccent: '#ff0000',
            colorAccentContrast: '#00ffff',
            colorAccentShade: '#990000',
            colorAccentTint: '#ff4d4d',
            /* Text */
            colorText: '#ccc',
            colorTextContrast: '#161617',
            colorTextShade: '#888',
            colorTextTint: '#fff',
        };

        // Create website configuration.
        const lConfiguration: WebsiteConfiguration = new WebsiteConfiguration('My Website', lColors);

        // Searchbar
        lConfiguration.content.head.searchbar = { placeholder: 'Suchen...' };
        lConfiguration.content.head.addAdditional(LoginControl);

        // Add Navigation
        lConfiguration.content.menu.addNavigation('Super Nav', {}, '/User');
        lConfiguration.content.menu.addNavigation('Super Nav 1', {}, '/User/2');
        lConfiguration.content.menu.addNavigation('Super Nav 2', {}, '/SomethingnotRight');

        @HtmlComponent({
            selector: lTestComponentShadowRoot,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestComponentClassShadowRoot implements IPwbOnAttributeChange {
            @Export valueNumber: number;
            @Export valueObject: object;
            @Export valueString: string;

            private mNumberCalled: boolean = false;
            private mObjectCalled: boolean = false;
            private mStringCalled: boolean = false;

            public onPwbAttributeChange(pAttributeName: string): void {
                if (pAttributeName === 'valueNumber') {
                    assert.equal(this.valueNumber, 123);

                    this.mNumberCalled = true;
                } else if (pAttributeName === 'valueString') {
                    assert.equal(this.valueString, 'abc');

                    this.mStringCalled = true;
                } else if (pAttributeName === 'valueObject') {
                    this.mObjectCalled = true;
                }

                if (this.mStringCalled && this.mNumberCalled && this.mObjectCalled) {
                    pDone();
                }
            }
        }

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
                <${lTestComponentShadowRoot} valueString="abc" [valueNumber]="123" [valueObject]="this.valueObject" />
            `,
        })
        class TestCustomElement {
            public valueObject = lConfiguration;
        }

        // Create
        lApp.addContent(TestCustomElement);
    });

    it('Missing elements after update', async () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `
            <div *pwbFor="pagingItem of this.pagingItemList">
                <div *pwbIf="typeof pagingItem === 'string'">{{pagingItem}}</div>
                <pwb-button *pwbIf="typeof pagingItem === 'number'" (click)="this.selectPage(pagingItem)">{{pagingItem}}</pwb-button>
            </div>
            `,
        })
        class TestCustomElement {
            public readonly pageCount: number = 25;
            public pagingItemList: Array<number | string>;

            /**
             * Building paging items and dispatch page select event.
             * @param pSelectedPageNumber - Select page.
             */
            public selectPage(pSelectedPageNumber: number): void {
                let lItemList: Array<number | string> = new Array<number | string>();

                // Display two numbers more than current page. [1,...,12,13,-14-,15,16,...,25]
                let lStartingPageDisplayNumber: number;
                if (pSelectedPageNumber > this.pageCount - 2) {
                    lStartingPageDisplayNumber = this.pageCount - 5;
                } else if (pSelectedPageNumber > 3) {
                    lStartingPageDisplayNumber = pSelectedPageNumber - 2;
                } else {
                    lStartingPageDisplayNumber = 1;
                }

                // Create paging range.
                for (let lPageNumber = lStartingPageDisplayNumber; lPageNumber <= this.pageCount && lItemList.length < 5; lPageNumber++) {
                    lItemList.push(lPageNumber);
                }

                // Add streaching display if first page display is not the first page number.
                if (lItemList[0] === 2) {
                    lItemList = [1, ...lItemList];
                } else if (lItemList[0] !== 1) {
                    lItemList = [1, '....', ...lItemList];
                }

                // Add streaching display if last page disply is not the last page number.
                if (lItemList[lItemList.length - 1] === this.pageCount - 1) {
                    lItemList = [...lItemList, this.pageCount];
                } else if (lItemList[lItemList.length - 1] !== this.pageCount) {
                    lItemList = [...lItemList, '....', this.pageCount];
                }

                // Save.
                this.pagingItemList = lItemList;

            }
        }

        const lCustomElement: HTMLElement & TestCustomElement = <any>lApp.addContent(TestCustomElement);
        (<TestCustomElement><any>ComponentConnection.componentManagerOf(lCustomElement).userObjectHandler.userObject).selectPage(1);
        await ComponentConnection.componentManagerOf(lCustomElement).updateHandler.waitForUpdate();
        (<TestCustomElement><any>ComponentConnection.componentManagerOf(lCustomElement).userObjectHandler.userObject).selectPage(6);
        await ComponentConnection.componentManagerOf(lCustomElement).updateHandler.waitForUpdate();

        assert.ok(lCustomElement instanceof Element);

        // [1,'...', x, x, x, x, x, '...', 25]
        // Check first level childs. [2 Header, 9Elements x (1 Header + 1 Element)] = 20
        assert.equal(lCustomElement.shadowRoot.childNodes.length, 20);

        assert.equal((<HTMLDivElement>lCustomElement.shadowRoot.childNodes[3]).firstElementChild.tagName.toLowerCase(), 'pwb-button');
        assert.equal((<HTMLDivElement>lCustomElement.shadowRoot.childNodes[5]).firstElementChild.tagName.toLowerCase(), 'div');
        assert.equal((<HTMLDivElement>lCustomElement.shadowRoot.childNodes[7]).firstElementChild.tagName.toLowerCase(), 'pwb-button');
        assert.equal((<HTMLDivElement>lCustomElement.shadowRoot.childNodes[9]).firstElementChild.tagName.toLowerCase(), 'pwb-button');
        assert.equal((<HTMLDivElement>lCustomElement.shadowRoot.childNodes[11]).firstElementChild.tagName.toLowerCase(), 'pwb-button');
        assert.equal((<HTMLDivElement>lCustomElement.shadowRoot.childNodes[13]).firstElementChild.tagName.toLowerCase(), 'pwb-button');
        assert.equal((<HTMLDivElement>lCustomElement.shadowRoot.childNodes[15]).firstElementChild.tagName.toLowerCase(), 'pwb-button');
        assert.equal((<HTMLDivElement>lCustomElement.shadowRoot.childNodes[17]).firstElementChild.tagName.toLowerCase(), 'div');
        assert.equal((<HTMLDivElement>lCustomElement.shadowRoot.childNodes[19]).firstElementChild.tagName.toLowerCase(), 'pwb-button');
    });


    it('Html text enclode', () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `&#60;&#62;`,
        })
        class TestCustomElement { }

        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);

        assert.ok(lCustomElement instanceof Element);
        assert.ok(lCustomElement.shadowRoot.childNodes[1] instanceof Text);
        assert.equal(lCustomElement.shadowRoot.childNodes[1].textContent, '<>');
    });

    it('Sibling update call', async () => {
        const lApp = new PwbApp('MyApp');

        // Create singleton injection.
        @Injector.InjectableSingleton
        class SingletonInjection {
            public value: boolean = false;

            public async process(): Promise<void> {
                return new Promise<void>((pResolve) => {
                    this.value = true;
                });
            }
        }

        const lParentSelector: string = gRandomSelector();
        const lChildSelector: string = gRandomSelector();

        // Create one parent and two sibling components.
        @HtmlComponent({
            selector: lParentSelector,
            template: `<${lChildSelector}/><${lChildSelector}/>`
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestParentControl { }

        @HtmlComponent({
            selector: lChildSelector,
            template: '<div *pwbIf="this.mObject.value"></div>'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestChildControl {
            public mObject: SingletonInjection;
            public constructor(pObject: SingletonInjection) {
                this.mObject = pObject;
            }
            public callFunction() {
                this.mObject.process();
            }
        }

        const lCustomElement: HTMLElement = lApp.addContent(TestParentControl);
        assert.equal(lCustomElement.shadowRoot.childNodes.length, 3);

        const lFirstChild: HTMLElement = <any>lCustomElement.shadowRoot.childNodes[1];
        const lSecondChild: HTMLElement = <any>lCustomElement.shadowRoot.childNodes[2];
        assert.equal(lFirstChild.tagName.toLowerCase(), lChildSelector.toLowerCase());
        assert.equal(lSecondChild.tagName.toLowerCase(), lChildSelector.toLowerCase());
        assert.equal(lFirstChild.shadowRoot.childNodes.length, 2);
        assert.equal(lSecondChild.shadowRoot.childNodes.length, 2);

        (<TestChildControl><any>ComponentConnection.componentManagerOf(lFirstChild).userObjectHandler.userObject).callFunction();
        await ComponentConnection.componentManagerOf(lFirstChild).updateHandler.waitForUpdate();
        await ComponentConnection.componentManagerOf(lSecondChild).updateHandler.waitForUpdate();

        assert.equal(lFirstChild.shadowRoot.childNodes.length, 4);
        assert.equal(lSecondChild.shadowRoot.childNodes.length, 4);
    });

    it('Event module cleanup', async () => {
        const lApp = new PwbApp('MyApp');

        const lChildSelector: string = gRandomSelector();

        @HtmlComponent({
            selector: lChildSelector,
            template: ''
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestChildControl {
            @HtmlComponentEvent('superevent')
            superEvent: ComponentEventEmitter<void> = new ComponentEventEmitter<void>();
            @Export value: number;

            public constructor() {
                const lListener = () => { return; };

                this.superEvent.addListener(lListener);
                this.superEvent.addListener(lListener);
            }
        }

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `<${lChildSelector} [value]="this.value" *pwbFor="item of this.list" (superevent)=""/>`
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestParentControl {
            public list = [1, 2, 3];
            public value: number = 3;
        }

        const lCustomElement: HTMLElement = lApp.addContent(TestParentControl);
        assert.equal(lCustomElement.shadowRoot.childNodes.length, 8);

        const lThirdElement: TestChildControl = <any>ComponentConnection.componentManagerOf(lCustomElement.shadowRoot.childNodes[7]).userObjectHandler.userObject;
        assert.equal((<Array<any>>(<any>lThirdElement.superEvent).mListener).length, 2);
        assert.equal(lThirdElement.value, 3);

        (<TestParentControl><any>ComponentConnection.componentManagerOf(lCustomElement).userObjectHandler.userObject).list = [1, 2];
        (<TestParentControl><any>ComponentConnection.componentManagerOf(lCustomElement).userObjectHandler.userObject).value = 12;
        await ComponentConnection.componentManagerOf(lCustomElement).updateHandler.waitForUpdate();
        assert.equal(lCustomElement.shadowRoot.childNodes.length, 6);
        assert.equal((<Array<any>>(<any>lThirdElement.superEvent).mListener).length, 1);
        assert.equal(lThirdElement.value, 3);
    });

    it('For Manipulator wrong format', () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `<div *pwbFor="item in this.list"/>` // item of this.list
        })
        class TestParentControl {
            public list = [1, 2, 3];
        }

        assert.throws(() => {
            lApp.addContent(TestParentControl);
        });
    });

    it('Wrong manipulation module', () => {
        @ManipulatorAttributeModule({
            accessType: ModuleAccessType.Write,
            attributeSelector: /^\*testerrormodule$/,
            forbiddenInManipulatorScopes: false,
            manipulatesAttributes: false
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongManipulatorAttributeModule implements IPwbMultiplicatorModuleOnUpdate {
            private readonly mTargetTemplate: XmlElement;
            private readonly mValueHandler: LayerValues;

            public constructor(pTargetTemplate: XmlElement, pValueHandler: LayerValues, pAttribute: XmlAttribute) {
                this.mTargetTemplate = pTargetTemplate;
                this.mValueHandler = pValueHandler;
            }

            public onUpdate(): MultiplicatorResult {
                // Cant add same template or value handler for multiple elements.
                const lModuleResult: MultiplicatorResult = new MultiplicatorResult();
                lModuleResult.addElement(this.mTargetTemplate, this.mValueHandler);
                lModuleResult.addElement(this.mTargetTemplate, this.mValueHandler);

                return lModuleResult;
            }
        }

        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `<div *testerrormodule/>`
        })
        class TestComponent { }

        let lHasError: boolean = false;
        lApp.addErrorListener(() => {
            lHasError = true;
        });

        assert.throws(() => {
            lApp.addContent(TestComponent);
        });
        assert.ok(lHasError);
    });

    it('Styles', () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            style: 'div12 {}'
        })
        class TestCustomElement { }

        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);
        assert.ok(lCustomElement.shadowRoot.firstChild instanceof HTMLStyleElement);
        assert.equal((<HTMLStyleElement>lCustomElement.shadowRoot.firstChild).innerHTML, 'div12 {}');
    });

    it('onCallbacks', async () => {
        const lApp = new PwbApp('MyApp');

        // Call flags
        let lAfterPwbInitializeCalled: boolean = false;
        let lAfterPwbUpdateCalled: boolean = false;
        let lOnPwbAttributeChangeCalled: boolean = false;
        let lOnPwbDeconstructCalled: boolean = false;
        let lOnPwbInitializeCalled: boolean = false;
        let lOnPwbUpdateCalled: boolean = false;

        @HtmlComponent({
            selector: gRandomSelector(),
            style: 'div12 {}',
            template: '{{this.value}}'
        })
        class TestCustomElement implements IPwbOnAttributeChange, IPwbOnDeconstruct, IPwbOnInit, IPwbOnUpdate, IPwbAfterInit, IPwbAfterUpdate {
            @Export value: number;

            afterPwbInitialize(): void {
                if (lAfterPwbInitializeCalled ||
                    lAfterPwbUpdateCalled ||
                    lOnPwbAttributeChangeCalled ||
                    lOnPwbDeconstructCalled ||
                    !lOnPwbInitializeCalled ||
                    !lOnPwbUpdateCalled) {
                    assert.fail('Wrong call order.');
                }

                lAfterPwbInitializeCalled = true;
            }
            afterPwbUpdate(): void {
                if (!lAfterPwbUpdateCalled) {
                    if (!lAfterPwbInitializeCalled ||
                        lAfterPwbUpdateCalled ||
                        lOnPwbAttributeChangeCalled ||
                        lOnPwbDeconstructCalled ||
                        !lOnPwbInitializeCalled ||
                        !lOnPwbUpdateCalled) {
                        assert.fail('Wrong call order.');
                    }

                    lAfterPwbUpdateCalled = true;
                }
            }
            onPwbAttributeChange(pAttributeName: string): void {
                if (pAttributeName === 'value') {
                    if (!lAfterPwbInitializeCalled ||
                        !lAfterPwbUpdateCalled ||
                        lOnPwbAttributeChangeCalled ||
                        lOnPwbDeconstructCalled ||
                        !lOnPwbInitializeCalled ||
                        !lOnPwbUpdateCalled) {
                        assert.fail('Wrong call order.');
                    }

                    lOnPwbAttributeChangeCalled = true;
                }
            }
            onPwbDeconstruct(): void {
                if (!lAfterPwbInitializeCalled ||
                    !lAfterPwbUpdateCalled ||
                    !lOnPwbAttributeChangeCalled ||
                    lOnPwbDeconstructCalled ||
                    !lOnPwbInitializeCalled ||
                    !lOnPwbUpdateCalled) {
                    assert.fail('Wrong call order.');
                }

                lOnPwbDeconstructCalled = true;
            }
            onPwbInitialize(): void {
                if (lAfterPwbInitializeCalled ||
                    lAfterPwbUpdateCalled ||
                    lOnPwbAttributeChangeCalled ||
                    lOnPwbDeconstructCalled ||
                    lOnPwbInitializeCalled ||
                    lOnPwbUpdateCalled) {
                    assert.fail('Wrong call order.');
                }

                lOnPwbInitializeCalled = true;
            }
            onPwbUpdate(): void {
                if (!lOnPwbUpdateCalled) {
                    if (lAfterPwbInitializeCalled ||
                        lAfterPwbUpdateCalled ||
                        lOnPwbAttributeChangeCalled ||
                        lOnPwbDeconstructCalled ||
                        !lOnPwbInitializeCalled ||
                        lOnPwbUpdateCalled) {
                        assert.fail('Wrong call order.');
                    }

                    lOnPwbUpdateCalled = true;
                }
            }
        }


        const lCustomElement: HTMLElement = lApp.addContent(TestCustomElement);
        document.body.appendChild(lCustomElement);

        await ComponentConnection.componentManagerOf(lCustomElement).updateHandler.waitForUpdate();

        // change export
        (<any>lCustomElement).value = 12;

        await ComponentConnection.componentManagerOf(lCustomElement).updateHandler.waitForUpdate();

        // deconstruct
        ComponentConnection.componentManagerOf(lCustomElement).deconstruct();

        assert.ok(lAfterPwbInitializeCalled);
        assert.ok(lAfterPwbUpdateCalled);
        assert.ok(lOnPwbAttributeChangeCalled);
        assert.ok(lOnPwbDeconstructCalled);
        assert.ok(lOnPwbInitializeCalled);
        assert.ok(lOnPwbUpdateCalled);
    });

    it('Loop detection', (pDone: Mocha.Done) => {
        const lApp = new PwbApp('MyApp');
        const lSelector = gRandomSelector();

        @HtmlComponent({
            selector: lSelector,
            style: 'div12 {}'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestCustomElement2 {
            @Export value: number = 1;
        }

        @HtmlComponent({
            selector: gRandomSelector(),
            template: `<${lSelector} [value]="++this.mValue" />`
        })
        class TestCustomElement {
            public mValue: number = 2;
        }

        lApp.addErrorListener((pError: any) => {
            if (pError instanceof LoopError) {
                pDone();
            }
        });

        lApp.addContent(TestCustomElement);
    });

    it('Keep this on @Export', () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            style: 'div12 {}'
        })
        class TestCustomElement {
            @Export myFunction() {
                assert.ok(this instanceof TestCustomElement);
            }
        }

        const lCustomElement: HTMLElement & TestCustomElement = <any>lApp.addContent(TestCustomElement);
        lCustomElement.myFunction();
    });

    it('UpdateMode: Manual', async () => {
        const lApp = new PwbApp('MyApp');

        @HtmlComponent({
            selector: gRandomSelector(),
            style: 'div12 {}',
            template: '{{this.value}}',
            updateScope: UpdateScope.Manual
        })
        class TestCustomElement implements IPwbAfterInit {
            public value: string = 'aaa';
            private readonly mUpdater: PwbUpdateReference;

            public constructor(pComponent: PwbUpdateReference) {
                this.mUpdater = pComponent;
            }

            @Export update(): void {
                this.mUpdater.update();
            }

            public afterPwbInitialize(): void {
                this.value = 'bbb';
            }
        }

        const lCustomElement: HTMLElement & TestCustomElement & HTMLElement = <any>lApp.addContent(TestCustomElement);
        document.body.appendChild(lCustomElement);

        // Wait for updates.
        await ComponentConnection.componentManagerOf(lCustomElement).updateHandler.waitForUpdate();

        assert.ok(lCustomElement.shadowRoot.firstChild instanceof HTMLStyleElement);
        assert.ok(lCustomElement.shadowRoot.childNodes[1] instanceof Comment);
        assert.ok(lCustomElement.shadowRoot.childNodes[2] instanceof Text);
        assert.equal(lCustomElement.shadowRoot.childNodes[2].textContent, 'aaa');

        // Update component and wait.
        lCustomElement.update();
        await ComponentConnection.componentManagerOf(lCustomElement).updateHandler.waitForUpdate();

        assert.ok(lCustomElement.shadowRoot.firstChild instanceof HTMLStyleElement);
        assert.ok(lCustomElement.shadowRoot.childNodes[1] instanceof Comment);
        assert.ok(lCustomElement.shadowRoot.childNodes[2] instanceof Text);
        assert.equal(lCustomElement.shadowRoot.childNodes[2].textContent, 'bbb');
    });
});