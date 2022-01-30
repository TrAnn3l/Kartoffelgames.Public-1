import { assert } from 'chai';
import { HtmlComponent } from '../source/decorator/html-component';
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

        const lApp = new PwbApp('MyApp', {
            targetSelector: 'body',
            content: TestCustomElement
        });
        assert.equal(lApp.changeDetection.name, 'MyApp');

        assert.throws(() => {
            lApp.addContent({});
        });

        const lNewLocation = document.createElement('div');
        lNewLocation.classList.add('newLocation');
        document.body.appendChild(lNewLocation);
        lApp.moveTo('.newLocation');

        assert.throws(() => {
            lApp.moveTo('.NotThere');
        });

        document.body.innerHTML = '';
    });

    it('Content list', () => {
        @HtmlComponent({ selector: gRandomSelector() })
        class TestCustomElement { }

        @HtmlComponent({ selector: gRandomSelector() })
        class TestCustomElement2 { }

        @HtmlComponent({ selector: gRandomSelector() })
        class TestCustomElement3 { }

        const lApp = new PwbApp('MyApp', {
            targetSelector: 'body',
            content: [TestCustomElement, TestCustomElement2]
        });

        const lAppRoot = document.body.querySelector('.PwbAppRoot');

        assert.ok(lAppRoot instanceof HTMLDivElement);

        assert.equal(lAppRoot.shadowRoot.childNodes.length, 2);

        lApp.addContent(TestCustomElement3);
        assert.equal(lAppRoot.shadowRoot.childNodes.length, 3);
    });

    it('Content without target', () => {
        @HtmlComponent({ selector: gRandomSelector() })
        class TestCustomElement { }

        new PwbApp('MyApp', {
            content: TestCustomElement
        });
    });

    it('Fails', () => {
        assert.throws(() => {
            new PwbApp('MyApp2', {
                targetSelector: '.NotThere'
            });
        });

        assert.throws(() => {
            new PwbApp('MyApp2', {
                content: {}
            });
        });
    });

    it('Styles', () => {
        const lApp = new PwbApp('MyApp2', {
            targetSelector: 'body',
            style: 'div2 {}',
            globalStyle: 'div {}'
        });

        assert.equal(document.head.querySelector('style').innerHTML, 'div {}');
        assert.equal((<ShadowRoot>(<any>lApp).mCurrentAppRootShadowRoot).querySelector('style').innerHTML, 'div2 {}');

        lApp.addStyle('div3 {}');
        assert.equal((<ShadowRoot>(<any>lApp).mCurrentAppRootShadowRoot).querySelector('style').innerHTML, 'div3 {}');
    });
});