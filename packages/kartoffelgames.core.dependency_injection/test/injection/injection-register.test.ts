import { expect } from 'chai';
import { InjectMode } from '../../source/enum/inject-mode';
import { InjectionRegister } from '../../source/injection/injection-register';
import { Injector } from '../../source/injector';
import { InjectionConstructor } from '../../source/type';

/**
 * Decorator.
 * Layers constructor with extends.
 * @param pConstructor - Constructor.
 */
const gPlaceholderDecorator = (pConstructor: InjectionConstructor) => {
    // Layer constructor.
    return class extends pConstructor { };
};

describe('InjectionRegister', () => {
    describe('Static Method: createObject', () => {
        // Not registered.
        // Default without parameter.
        // Default with patameter.
        // Default with parameter that has singleton.
        // Default with parameter, parameter not registered.
        // Singleton.
        // Singleton double creation.
        // Singleton force create. 
        // Default with layerd history.
        // Default with layerd history, change parameter, should fail.
        // Default with parameter, parameter is layered.
    });

    it('Static Method: registerInjectable', () => {
        // Setup.
        class Type { }

        // Process.
        InjectionRegister.registerInjectable(Type, InjectMode.Instanced);
        const lCreatedObject = InjectionRegister.createObject<Type>(Type);

        // Evaluation.
        expect(lCreatedObject).to.be.an.instanceOf(Type);
    });

    describe('Static Method: replaceInjectable', () => {
        it('-- Default', () => {
            // Setup. Types.
            class OriginalType { }
            class ReplacementType { }

            // Setup. Type with injected parameter.
            @Injector.Injectable
            class TestClass {
                public a: any;
                constructor(pType: OriginalType) {
                    this.a = pType;
                }
            }

            // Setup. Register injectable.
            InjectionRegister.registerInjectable(OriginalType, InjectMode.Instanced);
            InjectionRegister.registerInjectable(ReplacementType, InjectMode.Instanced);

            // Process.
            InjectionRegister.replaceInjectable(OriginalType, ReplacementType);
            const lCreatedObject = InjectionRegister.createObject<TestClass>(TestClass);

            // Evaluation.
            expect(lCreatedObject.a).to.be.an.instanceOf(ReplacementType);
        });

        it('-- Original not registerd', () => {
            // Setup. Types.
            class OriginalType { }
            class ReplacementType { }

            // Setup. Register injectable.
            InjectionRegister.registerInjectable(ReplacementType, InjectMode.Instanced);

            // Process.
            const lThrowErrorFunction = () => {
                InjectionRegister.replaceInjectable(OriginalType, ReplacementType);
            };

            // Evaluation.
            expect(lThrowErrorFunction).to.throw('Original constructor is not registered.');
        });

        it('-- Original not registerd', () => {
            // Setup. Types
            class OriginalType { }
            class ReplacementType { }

            // Setup. Register injectable.
            InjectionRegister.registerInjectable(OriginalType, InjectMode.Instanced);

            // Process.
            const lThrowErrorFunction = () => {
                InjectionRegister.replaceInjectable(OriginalType, ReplacementType);
            };

            // Evaluation.
            expect(lThrowErrorFunction).to.throw('Replacement constructor is not registered.');
        });
    });
});