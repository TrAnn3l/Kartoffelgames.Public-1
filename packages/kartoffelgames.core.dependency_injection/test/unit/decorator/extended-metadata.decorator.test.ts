import { expect } from 'chai';
import { ExtendedMetadata } from '../../../source/decorator/extended-metadata.decorator';
import { Metadata } from '../../../source/metadata/metadata';

describe('ExtendedMetadata', () => {
    describe('Decorator: Metadata', () => {
        it('-- Constructor Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};

            // Process.
            @ExtendedMetadata(lMetadataKey, lMetadataValue)
            class TestA { }

            // Process. Read metadata.
            const lResultMetadataValue: object = Metadata.get(TestA).getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).to.equal(lMetadataValue);
        });

        it('-- Property Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};
            const lPropertyName: unique symbol = Symbol('propertyname');

            // Process.         
            class TestA {
                @ExtendedMetadata(lMetadataKey, lMetadataValue)
                public [lPropertyName]: string;
            }

            // Process. Read metadata.
            const lResultMetadataValue: object = Metadata.get(TestA).getProperty(lPropertyName).getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).to.equal(lMetadataValue);
        });

        it('-- Property Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};

            // Process.         
            class TestA {
                @ExtendedMetadata(lMetadataKey, lMetadataValue)
                public function(): string { return ''; }
            }

            // Process. Read metadata.
            const lResultMetadataValue: object = Metadata.get(TestA).getProperty('function').getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).to.equal(lMetadataValue);
        });

        it('-- Accessor Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};
            const lPropertyName: unique symbol = Symbol('propertyname');

            // Process.         
            class TestA {
                @ExtendedMetadata(lMetadataKey, lMetadataValue)
                public get [lPropertyName](): string { return ''; }
            }

            // Process. Read metadata.
            const lResultMetadataValue: object = Metadata.get(TestA).getProperty(lPropertyName).getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).to.equal(lMetadataValue);
        });
    });
});