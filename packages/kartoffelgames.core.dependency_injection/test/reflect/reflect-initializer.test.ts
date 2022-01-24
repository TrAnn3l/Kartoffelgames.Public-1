import { expect } from 'chai';
import { MemberType } from '../../source/enum/member-type';
import { ReflectInitializer } from '../../source/reflect/reflect-initializer';
import { InjectionConstructor } from '../../source/type';
import { TypeRegister } from '../../source/type_register/type-register';

/**
 * Decorator.
 * @param pArgs - I can be anything you want.
 */
const gPlaceholderDecorator = (...pArgs: Array<any>): any => {
    // Nothing.

};

describe('ReflectInitializer', () => {
    it('Static Method: initialize', () => {
        // Process
        ReflectInitializer.initialize();

        // Process. Get exported functions.
        const lMetadata = Reflect.get(Reflect, 'metadata');
        const lDecorate = Reflect.get(Reflect, 'decorate');

        // Evaluation.
        expect(typeof lMetadata).to.equal('function');
        expect(typeof lDecorate).to.equal('function');
    });

    describe('Functionality: Metadata', () => {
        it('-- Property Type Metadata', () => {
            // Setup.
            class TestA {
                @gPlaceholderDecorator
                public property: string;
            }

            // Process. Get type information.
            const lMemberTypeList: Array<InjectionConstructor> = TypeRegister.getMemberTypes(TestA, 'property', MemberType.Member);

            // Process.
            expect(lMemberTypeList[0]).to.equal(String);
        });

        it('-- Function Parameter Type Metadata', () => {
            // Setup.
            class TestA {
                @gPlaceholderDecorator
                public function(_pFirst: number, _pSecond: string): string { return ''; }
            }

            // Process. Get type information.
            const lParameterTypeList: Array<InjectionConstructor> = TypeRegister.getMemberTypes(TestA, 'function', MemberType.Parameter);

            // Process.
            expect(lParameterTypeList).to.have.ordered.members([Number, String]);
        });

        it('-- Function Result Type Metadata', () => {
            // Setup.
            class TestA {
                @gPlaceholderDecorator
                public function(): string { return ''; }
            }

            // Process. Get type information.
            const lResultTypeList: Array<InjectionConstructor> = TypeRegister.getMemberTypes(TestA, 'function', MemberType.Result);

            // Process.
            expect(lResultTypeList[0]).to.equal(String);
        });

        it('-- Constructor Property Type Metadata', () => {
            // Setup.
            @gPlaceholderDecorator
            class TestA {
                public constructor(_pFirst: string, pSecond: number) { /* Nothing */ }
            }

            // Process. Get type information.
            const lConstructorParameterTypeList: Array<InjectionConstructor> = TypeRegister.getConstructorParameterTypes(TestA);

            // Process.
            expect(lConstructorParameterTypeList).to.have.ordered.members([String, Number]);
        });
    });

    describe('Functionality: Decorate', () => {
        // -- Decorate Constructor Keep Original
        // -- Decorate Constructor Replace Original
        // -- Decorate Constructor Return Wrong Value

        // -- Decorate Property Keep Original
        // -- Decorate Property Replace Original
        // -- Decorate Property Return Wrong Value

        // -- Decorate Function Keep Original
        // -- Decorate Function Replace Original
        // -- Decorate Function Return Wrong Value
    });
});