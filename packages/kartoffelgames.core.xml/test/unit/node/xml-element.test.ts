import { expect } from 'chai';
import { BaseXmlNode } from '../../../source/node/base-xml-node';
import { XmlAttribute } from '../../../source/attribute/xml-attribute';
import { CommentNode } from '../../../source/node/comment-node';
import { XmlElement } from '../../../source/node/xml-element';
import { XmlDocument } from '../../../source/document/xml-document';

describe('XmlElement', () => {

    describe('Property: document', () => {
        it('-- Read: XmlElement has a document', () => {
            // Setup. Create xml element. 
            const lXmlElement: XmlElement = new XmlElement();

            // Setup. Create xml document and append xml element.
            const lDocument: XmlDocument = new XmlDocument('');
            lDocument.appendChild(lXmlElement);

            // Process.
            const lXmlElementDocument: XmlDocument = lXmlElement.document;

            // Evaluation.
            expect(lXmlElementDocument).to.be.equal(lDocument);
        });

        it('-- Read: XmlElement has no document', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();

            // Process.
            const lXmlElementDocument: XmlDocument = lXmlElement.document;

            // Evaluation.
            expect(lXmlElementDocument).to.be.null;
        });
    });

    it('Property: parent', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        const lParentElement: XmlElement = new XmlElement();

        // Process.
        lXmlElement.parent = lParentElement;

        // Evaluation.
        expect(lXmlElement.parent).to.be.equal(lParentElement);
    });

    it('Property: attributeList', () => {
        // Setup. Specify values.
        const lAttributeName1: string = 'Attribute1';
        const lAttributeName2: string = 'Attribute2';
        const lAttributeValue1: string = 'Value1';
        const lAttributeValue2: string = 'Value2';

        // Setup. Create xml element add set attributes.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.setAttribute(lAttributeName1, lAttributeValue1);
        lXmlElement.setAttribute(lAttributeName2, lAttributeValue2);

        // Process
        const lAttributeList: Array<XmlAttribute> = lXmlElement.attributeList;

        // Evaluation
        const lMapList: Array<{ name: string, value: string; }> = lAttributeList.map((pAttribute: XmlAttribute) => ({ name: pAttribute.name, value: pAttribute.value }));
        expect(lMapList).to.have.deep.members([{ name: lAttributeName1, value: lAttributeValue1 }, { name: lAttributeName2, value: lAttributeValue2 }]);
    });

    it('Property: childList', () => {
        // Setup. Create child elements.
        const lChildElement1: XmlElement = new XmlElement();
        const lChildElement2: XmlElement = new XmlElement();

        // Setup. Cretae parent element and append childs.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.appendChild(lChildElement1);
        lXmlElement.appendChild(lChildElement2);

        // Process.
        const lChildList: Array<BaseXmlNode> = lXmlElement.childList;

        // Evaluation.
        expect(lChildList).to.have.members([lChildElement1, lChildElement2]);
    });

    describe('Property: namespace', () => {
        it('-- Read: Namespace from prefix defined locally', () => {
            // Setup. Specify values.
            const lNamespace: string = 'Namespace';
            const lNamespacePrefix: string = 'NamespacePrefix';

            // Setup. Create xml element and set namespace settings.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.namespacePrefix = lNamespacePrefix;
            lXmlElement.setAttribute(lNamespacePrefix, lNamespace, 'xmlns');

            // Process.
            const lNamespaceResult: string = lXmlElement.namespace;

            // Evaluation.
            expect(lNamespaceResult).to.equal(lNamespace);
        });

        it('-- Read: Namespace from prefix defined locally', () => {
            // Setup. Specify values.
            const lNamespace: string = 'Namespace';
            const lNamespacePrefix: string = 'NamespacePrefix';

            // Setup. Create child element.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.namespacePrefix = lNamespacePrefix;

            // Setup. Create parent element, set default namespace and append child element.
            const lParentXmlElement: XmlElement = new XmlElement();
            lParentXmlElement.setAttribute('Key', 'Value'); // None namespace defining attribute.
            lParentXmlElement.setAttribute(lNamespacePrefix, lNamespace, 'xmlns');
            lParentXmlElement.appendChild(lXmlElement);

            // Process.
            const lNamespaceResult: string = lXmlElement.namespace;

            // Evaluation.
            expect(lNamespaceResult).to.equal(lNamespace);
        });

        it('-- Read: Namespace from prefix defined locally', () => {
            // Setup. Specify values.
            const lNamespace: string = 'Namespace';

            // Setup. Create xml element and set default namespace.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.setAttribute('xmlns', lNamespace);

            // Process.
            const lNamespaceResult: string = lXmlElement.namespace;

            // Evaluation.
            expect(lNamespaceResult).to.equal(lNamespace);
        });

        it('-- Read: Namespace from prefix defined locally', () => {
            // Setup. Specify values.
            const lNamespace: string = 'Namespace';

            // Setup. Create child element.
            const lXmlElement: XmlElement = new XmlElement();

            // Setup. Create parent element, set namespace and append child.
            const lParentXmlElement: XmlElement = new XmlElement();
            lParentXmlElement.setAttribute('xmlns', lNamespace);
            lParentXmlElement.appendChild(lXmlElement);

            // Process.
            const lNamespaceResult: string = lXmlElement.namespace;

            // Evaluation.
            expect(lNamespaceResult).to.equal(lNamespace);
        });

        it('-- Read: Namespace from prefix defined locally', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();

            // Process.
            const lNamespaceResult: string = lXmlElement.namespace;

            // Evaluation.
            expect(lNamespaceResult).to.be.null;
        });

        it('-- Read: Namespace from parent XmlDocument', () => {
            // Setup. Create elements.
            const lDefaultNamespace: string = 'DEFAULT__NAMESPACE';
            const lDocument: XmlDocument = new XmlDocument(lDefaultNamespace);
            const lXmlElement: XmlElement = new XmlElement();

            // Setup. Append xml element to document.
            lDocument.appendChild(lXmlElement);

            // Process.
            const lNamespaceResult: string = lXmlElement.namespace;

            // Evaluation.
            expect(lNamespaceResult).to.equal(lDefaultNamespace);
        });

        it('-- Read: Namespace prefix without namespace definition', () => {
            // Setup. Create xml element and set default namespace.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.namespacePrefix = 'prefix';

            // Process.
            const lNamespaceResult: string = lXmlElement.namespace;

            // Evaluation.
            expect(lNamespaceResult).to.be.null;
        });
    });

    it('Property: namespacePrefix', () => {
        // Setup. Specify values.
        const lNamespacePrefix: string = 'NamespacePrefix';

        // Setup. Create xml element and set namespace prefix.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.namespacePrefix = lNamespacePrefix;

        // Process.
        const lNamespacePrefixResult: string = lXmlElement.namespacePrefix;

        // Evaluation.
        expect(lNamespacePrefixResult).to.equal(lNamespacePrefix);
    });

    describe('Property: qualifiedTagName', () => {
        it('-- Read: With namespace prefix', () => {
            // Setup. Specify values.
            const lNamespacePrefix: string = 'NamespacePrefix';
            const lTagName: string = 'ElementName';

            // Setup. Create xml element.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.tagName = lTagName;
            lXmlElement.namespacePrefix = lNamespacePrefix;

            // Process.
            const lQualifiedTagName: string = lXmlElement.qualifiedTagName;

            // Evaluation.
            expect(lQualifiedTagName).to.equal(`${lNamespacePrefix}:${lTagName}`);
        });
        it('-- Read: Without namespace prefix', () => {
            // Setup. Specify values.
            const lTagName: string = 'ElementName';

            // Setup. Create xml element.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.tagName = lTagName;

            // Process.
            const lQualifiedTagName: string = lXmlElement.qualifiedTagName;

            // Evaluation.
            expect(lQualifiedTagName).to.equal(lTagName);
        });
    });

    describe('Property: tagName', () => {
        it('-- Read: Set tagName', () => {
            // Setup. Specify values.
            const lTagName: string = 'ElementName';

            // Setup. Create xml element.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.tagName = lTagName;

            // Process.
            const lTagNameResult: string = lXmlElement.tagName;

            // Evaluation.
            expect(lTagNameResult).to.equal(lTagName);
        });

        it('-- Read: Empty tagName', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();

            // Process.
            const lTagNameResult: string = lXmlElement.tagName;

            // Evaluation.
            expect(lTagNameResult).to.equal('');
        });
    });

    it('Method: appendChild', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        const lChildElement1: XmlElement = new XmlElement();

        // Process.
        lXmlElement.appendChild(lChildElement1);

        // Evaluation.
        expect(lXmlElement.childList).to.have.members([lChildElement1]);
    });

    it('Method: clone', () => {
        // Setup. Create child element.
        const lChildElement: XmlElement = new XmlElement();
        lChildElement.tagName = 'ChildElement1';
        lChildElement.namespacePrefix = null; // Set internal property.

        // Setup. Create parent element and append child.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.tagName = 'XmlElement';
        lXmlElement.namespacePrefix = null; // Set internal property.
        lXmlElement.appendChild(lChildElement);
        lXmlElement.setAttribute('Key1', 'Value1', 'NamespacePrefix');
        lXmlElement.setAttribute('Key2', 'Value2');

        // Process.
        const lClonedXmlElement: XmlElement = lXmlElement.clone();

        // Evaluation.
        expect(lClonedXmlElement).to.not.equal(lXmlElement);
        expect(lClonedXmlElement).to.deep.equal(lXmlElement);
    });

    it('Functionality: Remove element from parent on append', () => {
        // Setup. Create child element.
        const lChildElement: XmlElement = new XmlElement();

        // Setup. Create parent element and append child.
        const lParentXmlElement1: XmlElement = new XmlElement();
        lParentXmlElement1.appendChild(lChildElement);

        // Setup. Create second parent element.
        const lParentXmlElement2: XmlElement = new XmlElement();

        // Process.
        lParentXmlElement2.appendChild(lChildElement);
        const lParentChildList1: Array<BaseXmlNode> = lParentXmlElement1.childList;
        const lParentChildList2: Array<BaseXmlNode> = lParentXmlElement2.childList;

        // Evaluation.
        expect(lParentChildList1).to.have.members([]);
        expect(lParentChildList2).to.have.members([lChildElement]);
    });

    it('Functionality: Set parent on append', () => {
        // Setup.
        const lParentXmlElement: XmlElement = new XmlElement();
        const lChildElement: XmlElement = new XmlElement();

        // Process.
        lParentXmlElement.appendChild(lChildElement);
        const lParent: BaseXmlNode = lChildElement.parent;

        // Evaluation.
        expect(lParent).to.equal(lParentXmlElement);
    });

    describe('Method: equals', () => {
        it('-- Equals everything', () => {
            // Setup. Cretae child element.
            const lChildElement1: XmlElement = new XmlElement();
            lChildElement1.tagName = 'ChildElement1';

            // Setup. Create parent and append child.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.tagName = 'XmlElement';
            lXmlElement.namespacePrefix = 'NamespacePrefix';
            lXmlElement.setAttribute('Key1', 'Value1', 'NamespacePrefix');
            lXmlElement.setAttribute('Key2', 'Value2');
            lXmlElement.setAttribute('xmlns', 'namespace');
            lXmlElement.appendChild(lChildElement1);

            // Setup. Clone parent element.
            const lClonedXmlElement: XmlElement = lXmlElement.clone();

            // Process.
            const lIsEqual: boolean = lXmlElement.equals(lClonedXmlElement);

            // Evaluation.
            expect(lIsEqual).to.be.true;
        });

        it('-- Unequal type', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();
            const lCommentElement: CommentNode = new CommentNode();

            // Process.
            const lIsEqual: boolean = lXmlElement.equals(lCommentElement);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Unequals tagname', () => {
            // Setup. Create element.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.tagName = 'XmlElement';

            // Setup. Create element with different tag name.
            const lXmlElement2: XmlElement = new XmlElement();
            lXmlElement2.tagName = 'XmlElementWrong';

            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Unequals namespacePrefix', () => {
            // Setup. Create element.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.namespacePrefix = 'NamespacePrefix';

            // Setup. Create element with different namespace prefix.
            const lXmlElement2: XmlElement = new XmlElement();
            lXmlElement2.namespacePrefix = 'NamespacePrefixWrong';

            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Unequals attribute count', () => {
            // Setup. Cretae element.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.setAttribute('Key', 'Value');

            // Setup. Create element without attribute.
            const lXmlElement2: XmlElement = new XmlElement();

            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Unequals attribute name', () => {
            // Setup. Create element.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.setAttribute('Key', 'Value');

            // Setup. Create element with different attribute.
            const lXmlElement2: XmlElement = new XmlElement();
            lXmlElement2.setAttribute('KeyWrong', 'Value');

            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Unequals attribute value', () => {
            // Setup. Create element.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.setAttribute('Key', 'Value');

            // Setup. Create element with different attribute value.
            const lXmlElement2: XmlElement = new XmlElement();
            lXmlElement2.setAttribute('Key', 'ValueWrong');

            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Unequals attribute namespace prefix', () => {
            // Setup. Create element.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.setAttribute('Key', 'Value', 'NamespacePrefix');

            // Setup. Create element with different attribute namespace prefix.
            const lXmlElement2: XmlElement = new XmlElement();
            lXmlElement2.setAttribute('Key', 'Value', 'NamespacePrefixWrong');

            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Unequals child count', () => {
            // Setup. Create element.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.appendChild(new XmlElement());

            // Setup. Create element without child.
            const lXmlElement2: XmlElement = new XmlElement();

            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Unequals child', () => {
            // Setup. Create element with child.
            const lXmlElement1Child: XmlElement = new XmlElement();
            lXmlElement1Child.tagName = 'XmlElement';
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.appendChild(lXmlElement1Child);

            // Setup. Create element with child element with different child tagname.
            const lXmlElement2Child: XmlElement = new XmlElement();
            lXmlElement2Child.tagName = 'XmlElementWrong';
            const lXmlElement2: XmlElement = new XmlElement();
            lXmlElement2.appendChild(lXmlElement2Child);

            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });
    });

    describe('Method: getAttribute', () => {
        it('-- Find attribute', () => {
            // Setup. Create attribute with xml element.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.setAttribute('Key', 'Value');

            // Setup. Get set attribute.
            const lAttribute: XmlAttribute = lXmlElement.attributeList[0];

            // Process.
            const lAttributeResult: XmlAttribute = lXmlElement.getAttribute('Key');

            // Evaluation.
            expect(lAttributeResult).to.equal(lAttribute);
        });

        it('-- Find no attribute', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();

            // Process.
            const lAttributeResult: XmlAttribute = lXmlElement.getAttribute('Key');

            // Evaluation.
            expect(lAttributeResult).to.be.undefined;
        });
    });

    describe('Method: removeAttribute', () => {
        it('-- Remove existing attribute', () => {
            // Setup. Specify values.
            const lAttributeKey: string = 'Key';

            // Setup. Create element.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.setAttribute(lAttributeKey, 'Value');

            // Process.
            const lIsRemoved: boolean = lXmlElement.removeAttribute(lAttributeKey);
            const lAttributeList: Array<XmlAttribute> = lXmlElement.attributeList;

            // Evaluation.
            expect(lIsRemoved).to.be.true;
            expect(lAttributeList).to.be.empty;
        });

        it('-- Remove none existing attribute', () => {
            // Setup.
            const lAttributeKey: string = 'Key';
            const lXmlElement: XmlElement = new XmlElement();

            // Process.
            const lIsRemoved: boolean = lXmlElement.removeAttribute(lAttributeKey);
            const lAttributeList: Array<XmlAttribute> = lXmlElement.attributeList;

            // Evaluation.
            expect(lIsRemoved).to.be.false;
            expect(lAttributeList).to.be.empty;
        });
    });

    describe('Method: removeChild', () => {
        it('-- Remove existing child', () => {
            // Setup.
            const lChildXmlElement: XmlElement = new XmlElement();
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.appendChild(lChildXmlElement);

            // Process.
            const lRemovedChild: BaseXmlNode = lXmlElement.removeChild(lChildXmlElement);
            const lChildList: Array<BaseXmlNode> = lXmlElement.childList;

            // Evaluation.
            expect(lRemovedChild).to.equal(lChildXmlElement);
            expect(lChildList).to.be.empty;
        });

        it('-- Remove none existing child', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();
            const lChildXmlElement: XmlElement = new XmlElement();

            // Process.
            const lRemovedChild: BaseXmlNode = lXmlElement.removeChild(lChildXmlElement);
            const lChildList: Array<BaseXmlNode> = lXmlElement.childList;

            // Evaluation.
            expect(lRemovedChild).to.be.undefined;
            expect(lChildList).to.be.empty;
        });
    });

    describe('Method: setAttribute', () => {
        it('-- Add attribute with namespace', () => {
            // Setup. Specify values.
            const lAttributeName: string = 'AttributeName';
            const lAttributeValue: string = 'AttributeValue';
            const lAttributeNamespacePrefix: string = 'NamespacePrefix';

            // Setup. Create reference xml attribute.
            const lXmlElement: XmlElement = new XmlElement();
            const lReferenceAttribute: XmlAttribute = new XmlAttribute(lAttributeName, lAttributeNamespacePrefix);
            lReferenceAttribute.value = lAttributeValue;
            lReferenceAttribute.xmlElement = lXmlElement;

            // Process.
            const lXmlAttribute: XmlAttribute = lXmlElement.setAttribute(lAttributeName, lAttributeValue, lAttributeNamespacePrefix);
            const lAttributeList: Array<XmlAttribute> = lXmlElement.attributeList;

            // Evaluation.
            expect(lAttributeList).to.has.lengthOf(1);
            expect(lXmlAttribute).to.deep.equal(lReferenceAttribute);
        });

        it('-- Add attribute without namespace', () => {
            // Setup.
            const lAttributeName: string = 'AttributeName';
            const lAttributeValue: string = 'AttributeValue';

            // Setup. Create reference xml attribute.
            const lXmlElement: XmlElement = new XmlElement();
            const lReferenceAttribute: XmlAttribute = new XmlAttribute(lAttributeName);
            lReferenceAttribute.value = lAttributeValue;
            lReferenceAttribute.xmlElement = lXmlElement;

            // Process.
            const lXmlAttribute: XmlAttribute = lXmlElement.setAttribute(lAttributeName, lAttributeValue);
            const lAttributeList: Array<XmlAttribute> = lXmlElement.attributeList;

            // Evaluation.
            expect(lAttributeList).to.has.lengthOf(1);
            expect(lXmlAttribute).to.deep.equal(lReferenceAttribute);
        });

        it('-- Change value attribute', () => {
            // Setup. Specify values.
            const lAttributeName: string = 'AttributeName';
            const lAttributeValue: string = 'AttributeValueChanged';
            const lAttributeNamespacePrefix: string = 'NamespacePrefix';

            // Setup. Create reference xml attribute.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.setAttribute(lAttributeName, 'OldAttributeValue', lAttributeNamespacePrefix);
            const lReferenceAttribute: XmlAttribute = new XmlAttribute(lAttributeName, lAttributeNamespacePrefix);
            lReferenceAttribute.value = lAttributeValue;
            lReferenceAttribute.xmlElement = lXmlElement;

            // Process.
            const lXmlAttribute: XmlAttribute = lXmlElement.setAttribute(lAttributeName, lAttributeValue, lAttributeNamespacePrefix);
            const lAttributeList: Array<XmlAttribute> = lXmlElement.attributeList;

            // Evaluation.
            expect(lAttributeList).to.has.lengthOf(1);
            expect(lXmlAttribute).to.deep.equal(lReferenceAttribute);
        });

        it('-- Add two attributes with same name and different prefix', () => {
            // Setup.
            const lAttributeName: string = 'AttributeName';
            const lXmlElement: XmlElement = new XmlElement();

            // Process.
            lXmlElement.setAttribute(lAttributeName, 'Value', 'Prefix1');
            lXmlElement.setAttribute(lAttributeName, 'Value', 'Prefix2');
            const lAttributeList: Array<XmlAttribute> = lXmlElement.attributeList;

            // Evaluation.
            expect(lAttributeList).to.has.lengthOf(2);
        });
    });
});