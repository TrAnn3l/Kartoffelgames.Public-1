import { expect } from 'chai';
import { InjectMode } from '../../source/enum/inject-mode';
import { InjectionRegister } from '../../source/injection/injection-register';
import { Injector } from '../../source/injector';

describe('InjectionRegister', () => {
    it('Static Method: registerInjectableObject', () => {
        // Setup.
        class Type { }

        // Process.
        InjectionRegister.registerInjectableObject(Type, InjectMode.Instanced);
        const lCreatedObject = InjectionRegister.createObject<Type>(Type);

        // Evaluation.
        expect(lCreatedObject).to.be.an.instanceOf(Type);
    });

    describe('Static Method: changeInjectableObject', () => {
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
            InjectionRegister.registerInjectableObject(OriginalType, InjectMode.Instanced);
            InjectionRegister.registerInjectableObject(ReplacementType, InjectMode.Instanced);

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
            InjectionRegister.registerInjectableObject(ReplacementType, InjectMode.Instanced);

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
            InjectionRegister.registerInjectableObject(OriginalType, InjectMode.Instanced);

            // Process.
            const lThrowErrorFunction = () => {
                InjectionRegister.replaceInjectable(OriginalType, ReplacementType);
            };

            // Evaluation.
            expect(lThrowErrorFunction).to.throw('Replacement constructor is not registered.');
        });
    });
});