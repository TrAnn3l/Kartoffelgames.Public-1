import { expect } from 'chai';
import { XmlParser } from '../../source/parser/xml-parser';
import { XmlElement } from '../../source/node/xml-element';
import { CommentNode } from '../../source/node/comment-node';
import { XmlAttribute } from '../../source/attribute/xml-attribute';
import { TextNode } from '../../source/node/text-node';
import { XmlDocument } from '../../source/document/xml-document';
import { Exception } from '@kartoffelgames/core.data';

describe('XmlParser', () => {
    describe('Method: parse', () => {
        describe('-- Node parsing', () => {
            it('-- Single XmlElement', () => {
                // Setup. Specify values.
                const lTagName: string = 'SingleNode';

                // Setup. Parse XML String.
                const lXmlString: string = `<${lTagName}></${lTagName}>`;
                const lParser: XmlParser = new XmlParser();

                // Process.
                const lXmlResult: XmlDocument = lParser.parse(lXmlString);
                const lXmlRoot: XmlElement = <XmlElement>lXmlResult.body[0];

                // Evaluation.
                expect(lXmlResult.body).to.has.lengthOf(1);
                expect(lXmlRoot.tagName).to.equal(lTagName);
                expect(lXmlRoot.childList).to.be.empty;
            });

            it('-- Void XmlElement', () => {
                // Setup. Specify values.
                const lTagName: string = 'voidnode';

                // Setup. Parse XML String.
                const lXmlString: string = `<${lTagName} />`;
                const lParser: XmlParser = new XmlParser();

                // Process.
                const lXmlResult: XmlDocument = lParser.parse(lXmlString);
                const lXmlRoot: XmlElement = <XmlElement>lXmlResult.body[0];

                // Evaluation.
                expect(lXmlResult.body).to.has.lengthOf(1);
                expect(lXmlRoot.tagName).to.equal(lTagName);
                expect(lXmlRoot.childList).to.be.empty;
            });

            it('-- CommentNode', () => {
                // Setup. Specify values.
                const lCommentText: string = 'CommentText';

                // Setup. Parse XML String.
                const lXmlString: string = `<!--${lCommentText}-->`;
                const lParser: XmlParser = new XmlParser();

                // Process.
                const lXmlResult: XmlDocument = lParser.parse(lXmlString);
                const lXmlRoot: CommentNode = <CommentNode>lXmlResult.body[0];

                // Evaluation.
                expect(lXmlResult.body).to.has.lengthOf(1);
                expect(lXmlRoot.text).to.equal(lCommentText);
            });

            it('-- TextNode', () => {
                // Setup. Specify values.
                const lText: string = 'TextNodeText';

                // Setup. Parse XML String.
                const lXmlString: string = lText;
                const lParser: XmlParser = new XmlParser();

                // Process.
                const lXmlResult: XmlDocument = lParser.parse(lXmlString);
                const lXmlRoot: TextNode = <TextNode>lXmlResult.body[0];

                // Evaluation.
                expect(lXmlResult.body).to.has.lengthOf(1);
                expect(lXmlRoot.text).to.equal(lText);
            });
        });

        describe('-- Attribute', () => {
            it('-- Attribute without value', () => {
                // Setup. Specify values.
                const lAttributeName: string = 'attrname';

                // Setup. Parse XML String.
                const lXmlString: string = `<singlenode ${lAttributeName} />`;
                const lParser: XmlParser = new XmlParser();
                const lXmlRoot: XmlElement = <XmlElement>lParser.parse(lXmlString).body[0];

                // Process.        
                const lAttributeList: Array<XmlAttribute> = lXmlRoot.attributeList;
                const lAttribute: XmlAttribute = lAttributeList[0];

                // Evaluation.
                expect(lAttributeList).to.be.lengthOf(1);
                expect(lAttribute.name).to.equal(lAttributeName);
                expect(lAttribute.value).to.equal('');
            });

            it('-- Attribute with value', () => {
                // Setup. Specify values.
                const lAttributeName: string = 'attrname';
                const lAttributeValue: string = 'attrvalue';

                // Setup. Parse XML String.
                const lXmlString: string = `<singlenode ${lAttributeName}="${lAttributeValue}" />`;
                const lParser: XmlParser = new XmlParser();
                const lXmlRoot: XmlElement = <XmlElement>lParser.parse(lXmlString).body[0];

                // Process.            
                const lAttributeList: Array<XmlAttribute> = lXmlRoot.attributeList;
                const lAttribute: XmlAttribute = lAttributeList[0];

                // Evaluation.
                expect(lAttributeList).to.be.lengthOf(1);
                expect(lAttribute.name).to.equal(lAttributeName);
                expect(lAttribute.value).to.equal(lAttributeValue);
            });
        });

        describe('-- Namespace Prefix', () => {
            it('-- Node Preifx', () => {
                // Setup. Specify values.
                const lNamespacePrefix: string = 't';

                // Setup. Parse XML String.
                const lXmlString: string = `<${lNamespacePrefix}:node />`;
                const lParser: XmlParser = new XmlParser();
                const lXmlResult: XmlDocument = lParser.parse(lXmlString);

                // Process.            
                const lXmlRoot: XmlElement = <XmlElement>lXmlResult.body[0];

                // Evaluation.
                expect(lXmlRoot.namespacePrefix).to.equal(lNamespacePrefix);
            });

            it('-- Attribute Prefix', () => {
                // Setup. Specify values.
                const lNamespacePrefix: string = 't';
                const lNamespacedAttributeName: string = 'namespacedattr';

                // Setup. Parse XML String.
                const lXmlString: string = `<node ${lNamespacePrefix}:${lNamespacedAttributeName} />`;
                const lParser: XmlParser = new XmlParser();
                const lXmlElement: XmlElement = <XmlElement>lParser.parse(lXmlString).body[0];

                // Process.
                const lNamespacedAttribute: XmlAttribute | undefined = lXmlElement.getAttribute(`${lNamespacePrefix}:${lNamespacedAttributeName}`);

                // Evaluation.
                expect(lNamespacedAttribute?.namespacePrefix).to.equal(lNamespacePrefix);
            });
        });

        it('-- Normalize multiline attribute values', () => {
            // Setup. Specify values.
            const lNamespacedAttributeName: string = 'namespacedattr';
            const lAttributeValue: string = `Multi
                                             Line`;

            // Setup. Parse XML String.
            const lXmlString: string = `<node ${lNamespacedAttributeName}="${lAttributeValue}" />`;
            const lParser: XmlParser = new XmlParser();
            const lXmlElement: XmlElement = <XmlElement>lParser.parse(lXmlString).body[0];

            // Process.
            const lNamespacedAttribute: XmlAttribute | undefined = lXmlElement.getAttribute(lNamespacedAttributeName);

            // Evaluation.
            expect(lNamespacedAttribute?.value).to.equal(lAttributeValue.replace('\n', ' '));
        });

        it('-- Multiline text node', () => {
            // Setup. Specify values.
            const lText: string = `Multi
                                   Line`;

            // Setup. Parse XML String.
            const lXmlString: string = `<node>${lText}</node>`;
            const lParser: XmlParser = new XmlParser();
            const lXmlElement: XmlElement = <XmlElement>lParser.parse(lXmlString).body[0];

            // Process.
            const lTextNode: TextNode = <TextNode>lXmlElement.childList[0];

            // Evaluation.
            expect(lTextNode.text).to.equal(lText);
        });

        it('-- Opening child with same tagname', () => {
            // Setup. Specify values.
            const lTagName: string = 'Tagname';

            // Setup. Parse XML String.
            const lXmlString: string = `<${lTagName}><${lTagName}></${lTagName}></${lTagName}>`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lXmlResult: XmlDocument = lParser.parse(lXmlString);
            const lParent: XmlElement = <XmlElement>lXmlResult.body[0];
            const lChild: XmlElement = <XmlElement>lParent.childList[0];

            // Evaluation. Check parent.
            expect(lParent.tagName).to.equal(lTagName);
            expect(lParent.childList).to.has.lengthOf(1);

            // Evaluation. Check child.
            expect(lChild.tagName).to.equal(lTagName);
            expect(lChild.childList).to.be.empty;
        });

        it('-- Void child with same tagname', () => {
            // Setup. Specify values.
            const lTagName: string = 'Tagname';

            // Setup. Parse XML String.
            const lXmlString: string = `<${lTagName}><${lTagName} /></${lTagName}>`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lXmlResult: XmlDocument = lParser.parse(lXmlString);
            const lParent: XmlElement = <XmlElement>lXmlResult.body[0];
            const lChild: XmlElement = <XmlElement>lParent.childList[0];

            // Evaluation. Check parent.
            expect(lParent.tagName).to.equal(lTagName);
            expect(lParent.childList).to.has.lengthOf(1);

            // Evaluation. Check child.
            expect(lChild.tagName).to.equal(lTagName);
            expect(lChild.childList).to.be.empty;
        });
    });

    describe('Functionality: Parser error', () => {
        it('-- Fail attribute parsing', () => {
            // Setup.
            const lWrongAttribute: string = '="noneclosing';
            const lXmlString: string = `<node attr${lWrongAttribute} />`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lFailingFunction = () => {
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lFailingFunction).to.throw(`Can't parse attribute part: "${lWrongAttribute}"`);
        });

        it('-- Unexpected closing tag', () => {
            // Setup.
            const lClosingNode: string = 'unexpectedclosing';
            const lXmlString: string = `<node></${lClosingNode}></node>`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lFailingFunction = () => {
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lFailingFunction).to.throw(`Error unexpected closing XML-Tag ${lClosingNode}`);
        });

        it(`-- Can't close tag`, () => {
            // Setup.
            const lClosingNode: string = 'nodename';
            const lXmlString: string = `<${lClosingNode}>`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lFailingFunction = () => {
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lFailingFunction).to.throw(`Error closing XML-Tag ${lClosingNode}`);
        });
    });

    describe('Functionality: Settings', () => {
        it('-- Remove comment', () => {
            // Setup.
            const lXmlString: string = `<!-- Comment -->`;
            const lParser: XmlParser = new XmlParser({ removeComments: true });

            // Process.
            const lParsedDocument: XmlDocument = lParser.parse(lXmlString);

            // Evaluation.
            expect(lParsedDocument.body).to.be.empty;
        });

        it('-- Restrict attribute characters', () => {
            // Setup.
            const lXmlString: string = `<node notAllowed />`;
            const lParser: XmlParser = new XmlParser({ allowedAttributeCharacters: 'abc' });

            // Process.
            const lFailingFunction = () => {
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lFailingFunction).to.throw(Exception);
        });

        it('-- Restrict tagname characters', () => {
            // Setup.
            const lXmlString: string = `<notallowed/>`;
            const lParser: XmlParser = new XmlParser({ allowedTagNameCharacters: 'abc' });

            // Process.
            const lFailingFunction = () => {
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lFailingFunction).to.throw(Exception);
        });
    });
});