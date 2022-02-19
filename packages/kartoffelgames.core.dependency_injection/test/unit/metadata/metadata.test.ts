import { expect } from 'chai';
import { ConstructorMetadata } from '../../../source/metadata/constructor-metadata';
import { Metadata } from '../../../source/metadata/metadata';
import { DecorationHistory } from '../../../source/decoration-history/decoration-history';
import { InjectionConstructor } from '../../../source/type';

/**
 * Decorator.
 * Layers constructor with extends.
 * @param pConstructor - Constructor.
 */
const gPlaceholderDecorator = (pConstructor: InjectionConstructor): any => {
    // Layer constructor.
    return class extends pConstructor { constructor(...pArgs: Array<any>) { super(...pArgs); } };
};

describe('Metadata', () => {
    describe('-- Static Method: get', () => {
        it('-- Create New Metadata', () => {
            // Setup.
            class TestA { };

            // Process.
            const lConstructorMetadata = Metadata.get(TestA);

            // Evaluation.
            expect(lConstructorMetadata).to.be.instanceOf(ConstructorMetadata);
        });

        it('-- Get Existing Metadata ', () => {
            // Setup.
            class TestA { };

            // Process.
            const lOldConstructorMetadata = Metadata.get(TestA);
            const lNewConstructorMetadata = Metadata.get(TestA);

            // Evaluation.
            expect(lOldConstructorMetadata).to.equal(lNewConstructorMetadata);
        });

        it('-- Get With Decoration History', () => {
            // Setup.
            @gPlaceholderDecorator
            class TestA {}

            // Setup. Get base class.
            const TestAParent = DecorationHistory.getRootOf(TestA);

            // Process.
            const lChildConstructorMetadata = Metadata.get(TestA);
            const lParentConstructorMetadata = Metadata.get(TestAParent);

            // Evaluation.
            expect(lChildConstructorMetadata).to.equal(lParentConstructorMetadata);
        });
    });
});