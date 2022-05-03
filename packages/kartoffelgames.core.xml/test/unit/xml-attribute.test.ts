import { expect } from 'chai';
import { XmlAttribute } from '../../source/attribute/xml-attribute';
import { XmlElement } from '../../source/node/xml-element';

describe('XmlAttribute', () => {
    it('Property: name', () => {
        // Setup.
        const lAttributeName: string = 'AttributeName';
        const lAttribute: XmlAttribute = new XmlAttribute(lAttributeName);

        // Process.
        const lAttributeNameResult: string = lAttribute.name;

        // Evaluation.
        expect(lAttributeNameResult).to.be.equal(lAttributeName);
    });

    describe('Property: namespace', () => {
        it('-- Namespace from Prefix', () => {
            // Setup. Specify values.
            const lNamespacePrefix: string = 'prefix';
            const lNamespace: string = 'Namespace';

            // Setup. Set xml attribute namespace with xml element.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.setAttribute(lNamespacePrefix, lNamespace, 'xmlns');
            const lAttribute: XmlAttribute = lXmlElement.setAttribute('Name', 'Value', lNamespacePrefix);

            // Process.
            const lAttributeNamespaceResult: string  | null= lAttribute.namespace;

            // Evaluation.
            expect(lAttributeNamespaceResult).to.be.equal(lNamespace);
        });

        it('-- No Namespace', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();
            const lAttribute: XmlAttribute = lXmlElement.setAttribute('Name', 'Value');

            // Process.
            const lAttributeNamespaceResult: string  | null= lAttribute.namespace;

            // Evaluation.
            expect(lAttributeNamespaceResult).to.be.null;
        });
    });

    it('Property: namespacePrefix', () => {
        // Setup.
        const lAttributeNamespacePrefix: string = 'NamespacePrefix';
        const lAttribute: XmlAttribute = new XmlAttribute('AttributeName', lAttributeNamespacePrefix);

        // Process.
        const lAttributeNamespacePrefixResult: string | null = lAttribute.namespacePrefix;

        // Evaluation.
        expect(lAttributeNamespacePrefixResult).to.be.equal(lAttributeNamespacePrefix);
    });

    it('Property: qualifiedName', () => {
        // Setup. Specify values.
        const lAttributeName: string = 'AttributeName';
        const lAttributeNamespacePrefix: string = 'NamespacePrefix';

        // Setup. Create attribute.
        const lAttribute: XmlAttribute = new XmlAttribute(lAttributeName, lAttributeNamespacePrefix);

        // Process.
        const lQualifierName: string = lAttribute.qualifiedName;

        // Evaluation.
        expect(lQualifierName).to.be.equal(`${lAttributeNamespacePrefix}:${lAttributeName}`);
    });

    it('Property: seperator', () => {
        // Setup.
        const lSeperator: string = '-';
        const lAttribute: XmlAttribute = new XmlAttribute('AttributeName', 'NamespacePrefix', lSeperator);

        // Process.
        const lSeperatorResult: string = lAttribute.seperator;

        // Evaluation.
        expect(lSeperatorResult).to.be.equal(lSeperator);
    });

    describe('Property: value', () => {
        it('-- With value', () => {
            // Setup.
            const lValue: string = 'New Value';
            const lAttribute: XmlAttribute = new XmlAttribute('AttributeName');

            // Process.
            lAttribute.value = lValue;
            const lValueResult: string = lAttribute.value;

            // Evaluation.
            expect(lValueResult).to.be.equal(lValue);
        });

        it('-- Without value', () => {
            // Setup.
            const lAttribute: XmlAttribute = new XmlAttribute('AttributeName');

            // Process.
            const lValueResult: string = lAttribute.value;

            // Evaluation.
            expect(lValueResult).to.be.equal('');
        });
    });

    it('Property: valueList', () => {
        // Setup. Specify values.
        const lValue: string = 'Value1-Value2';
        const lSeperator: string = '-';

        // Setup. Create atribute.
        const lAttribute: XmlAttribute = new XmlAttribute('AttributeName', 'NamespacePrefix', lSeperator);
        lAttribute.value = lValue;

        // Process.
        const lValueList: Array<string> = lAttribute.valueList;

        // Evaluation.
        expect(lValueList).to.be.deep.equal(['Value1', 'Value2']);
    });
});