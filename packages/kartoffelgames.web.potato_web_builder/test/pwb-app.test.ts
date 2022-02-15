import { assert } from 'chai';
import { HtmlComponent } from '../source/decorator/component/html-component';
import { PwbApp } from '../source/pwb-app';

const gRandomSelector = (): string => {
    let lResult = '';
    const lCharacters = 'abcdefghijklmnopqrstuvwxyz';
    const lCharactersLength = lCharacters.length;
    for (let lIndex = 0; lIndex < 10; lIndex++) {
        lResult += lCharacters.charAt(Math.floor(Math.random() * lCharactersLength));
    }
    return `${lResult}-${lResult}`;
};

describe('PwbApp', () => {
    it('Default', () => {
        @HtmlComponent({ selector: gRandomSelector() })
        class TestCustomElement { }

        const lApp = new PwbApp('MyApp');
        lApp.addContent(TestCustomElement);
        lApp.appendTo(document.body);

        assert.throws(() => {
            lApp.addContent(<any>{});
        });

        const lNewLocation = document.createElement('div');
        lNewLocation.classList.add('newLocation');
        document.body.appendChild(lNewLocation);
        lApp.appendTo(document.querySelector('.newLocation'));

        document.body.innerHTML = '';
    });

    it('Content list', () => {
        @HtmlComponent({ selector: gRandomSelector() })
        class TestCustomElement { }

        @HtmlComponent({ selector: gRandomSelector() })
        class TestCustomElement2 { }

        @HtmlComponent({ selector: gRandomSelector() })
        class TestCustomElement3 { }

        const lApp = new PwbApp('MyApp');
        lApp.addContent(TestCustomElement);
        lApp.addContent(TestCustomElement2);
        lApp.appendTo(document.body);

        const lAppRoot = document.body.querySelector('.PwbAppRoot');

        assert.ok(lAppRoot instanceof HTMLDivElement);

        assert.equal(lAppRoot.shadowRoot.childNodes.length, 2);

        lApp.addContent(TestCustomElement3);
        assert.equal(lAppRoot.shadowRoot.childNodes.length, 3);
    });
});