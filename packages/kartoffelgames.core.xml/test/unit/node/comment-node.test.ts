import { expect } from 'chai';
import { TextNode } from '../../../source/node/text-node';
import { CommentNode } from '../../../source/node/comment-node';
import { XmlElement } from '../../../source/node/xml-element';

describe('CommentNode', () => {
    describe('Property: defaultNamespace', () => {
        it('-- Read: Has namespace', () => {
            // Setup. Specify values.
            const lNamespace: string = 'Namespace';

            // Setup. Create parent xml element.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.setAttribute('xmlns', lNamespace);

            // Setup. Create comment node.
            const lCommentNode: CommentNode = new CommentNode();
            lXmlElement.appendChild(lCommentNode);

            // Process.
            const lCommentNodeDefaultNamespace: string | null= lCommentNode.defaultNamespace;

            // Evaluation.
            expect(lCommentNodeDefaultNamespace).to.equal(lNamespace);
        });

        it('-- Read: Has no namespace', () => {
            // Setup.
            const lCommentNode: CommentNode = new CommentNode();

            // Process.
            const lCommentNodeDefaultNamespace: string  | null= lCommentNode.defaultNamespace;

            // Evaluation.
            expect(lCommentNodeDefaultNamespace).to.be.null;
        });
    });

    describe('Property: text', () => {
        it('-- Read', () => {
            // Setup. Specify values.
            const lText: string = 'Text';

            // Setup. Create comment node with specified values.
            const lCommentNode: CommentNode = new CommentNode();
            lCommentNode.text = lText;

            // Process.
            const lTextResult: string = lCommentNode.text;

            // Evaluation.
            expect(lText).to.equal(lTextResult);
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lText: string = 'Text';

            // Setup. Create comment node with specified values.
            const lCommentNode: CommentNode = new CommentNode();
            lCommentNode.text = 'OldText';

            // Process.
            lCommentNode.text = lText;

            // Evaluation.
            expect(lCommentNode.text).to.equal(lText);
        });
    });

    it('Method: clone', () => {
        // Setup.
        const lCommentNode: CommentNode = new CommentNode();
        lCommentNode.text = 'Text';

        // Process.
        const lClonedCommentNode: CommentNode = lCommentNode.clone();

        // Evaluation.
        expect(lClonedCommentNode).to.not.equal(lCommentNode);
        expect(lClonedCommentNode).to.deep.equal(lCommentNode);
    });

    describe('Method: equals', () => {
        it('-- Equals everything', () => {
            // Setup. Create comment node.
            const lCommentNode: CommentNode = new CommentNode();
            lCommentNode.text = 'Text';

            // Setup. Clone comment node.
            const lClonedCommentNode: CommentNode = lCommentNode.clone();

            // Process.
            const lIsEqual: boolean = lCommentNode.equals(lClonedCommentNode);

            // Evaluation.
            expect(lIsEqual).to.be.true;
        });

        it('-- Unequal type', () => {
            // Setup. Create comment node.
            const lCommentNode: CommentNode = new CommentNode();
            lCommentNode.text = 'Text';

            // Setup. Create text node.
            const lTextNode: TextNode = new TextNode();
            lTextNode.text = 'Text';

            // Process.
            const lIsEqual: boolean = lCommentNode.equals(lTextNode);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Unequals text', () => {
            // Setup. Create comment node.
            const lCommentNode1: CommentNode = new CommentNode();
            lCommentNode1.text = 'Text';

            // Setup. Create comment node with different text.
            const lCommentNode2: CommentNode = new CommentNode();
            lCommentNode2.text = 'TextWrong';

            // Process.
            const lIsEqual: boolean = lCommentNode1.equals(lCommentNode2);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });
    });
});