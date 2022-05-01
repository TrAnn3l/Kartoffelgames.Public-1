import { expect } from 'chai';
import { TextNode } from '../../../source/node/text-node';
import { CommentNode } from '../../../source/node/comment-node';
import { XmlElement } from '../../../source/node/xml-element';

describe('TextNode', () => {
    describe('Property: defaultNamespace', () => {
        it('-- Read: Has namespace', () => {
            // Setup.
            const lNamespace: string = 'Namespace';

            // Setup. Create parent xml element.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.setAttribute('xmlns', lNamespace);

            // Setup. Create text node.
            const lTextNode: TextNode = new TextNode();
            lXmlElement.appendChild(lTextNode);

            // Process.
            const lTextNodeDefaultNamespace: string  | null= lTextNode.defaultNamespace;

            // Evaluation.
            expect(lTextNodeDefaultNamespace).to.equal(lNamespace);
        });

        it('-- Read: Has no namespace', () => {
            // Setup.
            const lTextNode: TextNode = new TextNode();

            // Process.
            const lTextNodeDefaultNamespace: string  | null= lTextNode.defaultNamespace;

            // Evaluation.
            expect(lTextNodeDefaultNamespace).to.be.null;
        });
    });

    describe('Property: text', () => {
        it('-- Read', () => {
            // Setup. Specify values.
            const lText: string = 'Text';

            // Setup. Create text node with specifed text.
            const lTextNode: TextNode = new TextNode();
            lTextNode.text = lText;

            // Process.
            const lTextResult: string = lTextNode.text;

            // Evaluation.
            expect(lText).to.equal(lTextResult);
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lText: string = 'Text';

            // Setup. Create text node.
            const lTextNode: TextNode = new TextNode();

            // Process.
            lTextNode.text = lText;

            // Evaluation.
            expect(lTextNode.text).to.equal(lText);
        });
    });

    it('Method: clone', () => {
        // Setup.
        const lTextNode: TextNode = new TextNode();
        lTextNode.text = 'Text';

        // Process.
        const lClonedTextNode: TextNode = lTextNode.clone();

        // Evaluation.
        expect(lClonedTextNode).to.not.equal(lTextNode);
        expect(lClonedTextNode).to.deep.equal(lTextNode);
    });

    describe('Method: equals', () => {
        it('-- Equals everything', () => {
            // Setup. Create text node.
            const lTextNode: TextNode = new TextNode();
            lTextNode.text = 'Text';

            // Setup. Clone text node.
            const lClonedTextNode: TextNode = lTextNode.clone();

            // Process.
            const lIsEqual: boolean = lTextNode.equals(lClonedTextNode);

            // Evaluation.
            expect(lIsEqual).to.be.true;
        });

        it('-- Unequal type', () => {
            // Setup. Create text node.
            const lTextNode: TextNode = new TextNode();
            lTextNode.text = 'Text';

            // Setup. Create. Comment node.
            const lCommentElement: CommentNode = new CommentNode();
            lCommentElement.text = 'Text';

            // Process.
            const lIsEqual: boolean = lTextNode.equals(lCommentElement);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Unequals text', () => {
            // Setup. Create text node.
            const lTextNode1: TextNode = new TextNode();
            lTextNode1.text = 'Text';

            // Setup. Create text node with different text.
            const lTextNode2: TextNode = new TextNode();
            lTextNode2.text = 'TextWrong';

            // Process.
            const lIsEqual: boolean = lTextNode1.equals(lTextNode2);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });
    });
});