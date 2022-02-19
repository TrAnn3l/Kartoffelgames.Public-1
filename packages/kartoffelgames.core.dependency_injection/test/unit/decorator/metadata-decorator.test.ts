import { expect } from 'chai';
import { Metadata } from '../../../source/metadata/metadata';
import { InjectableDecorator } from '../../../source/decorator/injectable-decorator';
import { MetadataDecorator } from '../../../source/decorator/metadata-decorator';
import { Injection } from '../../../source/injection/injection';


describe('MetadataDecorator', () => {
    describe('Decorator: Metadata', () => {
        it('-- Constructor Metadata', () => {
            // Setup.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: object = {};

            // Process.
            @MetadataDecorator(lMetadataKey, lMetadataValue)
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
                @MetadataDecorator(lMetadataKey, lMetadataValue)
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
                @MetadataDecorator(lMetadataKey, lMetadataValue)
                public function(): string { return null; }
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
                @MetadataDecorator(lMetadataKey, lMetadataValue)
                public get [lPropertyName](): string { return null; }
            }

            // Process. Read metadata.
            const lResultMetadataValue: object = Metadata.get(TestA).getProperty(lPropertyName).getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadataValue).to.equal(lMetadataValue);
        });
    });
});