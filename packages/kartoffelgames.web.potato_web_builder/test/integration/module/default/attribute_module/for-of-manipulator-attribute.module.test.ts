import { expect } from 'chai';
import { HtmlComponent } from '../../../../../source/decorator/component/html-component';
import { Export } from '../../../../../source/index';
import '../../../../mock/request-animation-frame-mock-session';
import '../../../../utility/ChaiHelper';
import { TestUtil } from '../../../../utility/TestUtil';

describe('ForOfManipulatorAttributeModule', () => {
    it('Array items', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbFor="item of this.list"/>`
        })
        class TestComponent {
            public list: Array<string> = ['One', 'Two', 'Three'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
            Comment, // -- Manipulator 3. Child Anchor
            HTMLDivElement, // 3. Element
        ], true);
    });

    it('Object properties', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbFor="item of this.list"/>`
        })
        class TestComponent {
            public list: object = {
                one: 'One',
                two: 'Two',
                three: 'Three'
            };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
            Comment, // -- Manipulator 3. Child Anchor
            HTMLDivElement, // 3. Element
        ], true);
    });

    it('Custom iterator', async () => {
        // Setup. Custom iterator.
        function* customIterator(pStart = 0, pEnd = 100) {
            let lIterationCount = 0;
            for (let lIndex = pStart; lIndex < pEnd; lIndex++) {
                lIterationCount++;
                yield lIndex;
            }
            return lIterationCount;
        }

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbFor="item of this.list"/>`
        })
        class TestComponent {
            public list: Generator<number, number> = customIterator(1, 4);
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
            Comment, // -- Manipulator 3. Child Anchor
            HTMLDivElement, // 3. Element
        ], true);
    });

    it('Push item to list', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbFor="item of this.list"/>`
        })
        class TestComponent {
            @Export
            public list: Array<string> = ['One'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.list.push('Two');
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            HTMLDivElement, // 1. Element
            Comment, // -- Manipulator 2. Child Anchor
            HTMLDivElement, // 2. Element
        ], true);
    });

    it('Null value', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbFor="item of this.list"/>`
        })
        class TestComponent {
            @Export
            public list: Array<string> = null;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
        ], true);
    });

    it('Use iterator item values', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbFor="item of this.list">{{item}}</div>`
        })
        class TestComponent {
            public list: Array<string> = [lTextContent];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);
    });

    it('Use object item values', async () => {
        // Setup. Text content.
        const lTextContent: string = 'TEXT CONTENT.';

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbFor="item of this.list">{{item}}</div>`
        })
        class TestComponent {
            public list: object = {
                one: lTextContent
            };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: lTextContent
            }
        ], true);
    });

    it('Array index', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbFor="item of this.list; index = $index">{{index}}</div>`
        })
        class TestComponent {
            public list: Array<string> = ['One', 'Two'];
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: '0'
            },
            Comment, // -- Manipulator 2. Child Anchor
            {
                node: HTMLDivElement,
                textContent: '1'
            }
        ], true);
    });

    it('Object property as index', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbFor="item of this.list; index = $index">{{index}}</div>`
        })
        class TestComponent {
            public list: object = {
                one: 'One',
                two: 'Two'
            };
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: 'one'
            },
            Comment, // -- Manipulator 2. Child Anchor
            {
                node: HTMLDivElement,
                textContent: 'two'
            }
        ], true);
    });

    it('Index calculation', async () => {
        const lList: Array<number> = [2, 4];

        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbFor="item of this.list; index = $index * item">{{index}}</div>`
        })
        class TestComponent {
            public list: Array<number> = lList;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).to.have.componentStructure([
            Comment, // Component Anchor
            Comment, // - Manipulator Anchor
            Comment, // -- Manipulator 1. Child Anchor
            {
                node: HTMLDivElement,
                textContent: (0 * lList[0]).toString()
            },
            Comment, // -- Manipulator 2. Child Anchor
            {
                node: HTMLDivElement,
                textContent: (1 * lList[1]).toString()
            }
        ], true);
    });

    it('Wrong syntax', async () => {
        // Setup. Define component.
        @HtmlComponent({
            selector: TestUtil.randomSelector(),
            template: `<div *pwbFor="item WRONG this.list"/>`
        })
        class TestComponent { }

        // Setup. Create element.
        let lErrorMessage: string;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (e) {
            lErrorMessage = e.message;
        }

        // Evaluation.
        expect(lErrorMessage).to.equal('pwbFor-Paramater value has wrong format: item WRONG this.list');
    });
});