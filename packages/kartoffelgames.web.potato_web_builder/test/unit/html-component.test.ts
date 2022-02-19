import { expect } from 'chai';
import { HtmlComponent } from '../../source/decorator/component/html-component';
import '../../source/index';
import '../mock/request-animation-frame-mock-session';
import '../utility/ChaiHelper';
import { TestUtil } from '../utility/TestUtil';

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
    describe('Functionality', () => {
        describe('-- Element render', () => {
            it('-- Static Template, single element', async () => {
                // Setup. Define component.
                @HtmlComponent({
                    selector: gRandomSelector(),
                    template: '<div/>'
                })
                class TestComponent { }

                // Process. Create element.
                const lComponent: HTMLElement = await TestUtil.createComponent(TestComponent);

                // Evaluation
                // 2 => StaticAnchor, Div.
                expect(lComponent.shadowRoot.childNodes).to.have.lengthOf(2);
                expect(lComponent).to.have.componentStructure([Comment, HTMLDivElement], true);
            });
        });
    });
});