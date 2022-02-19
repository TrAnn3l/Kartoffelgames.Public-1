import { Dictionary } from '@kartoffelgames/core.data';
import { expect } from 'chai';
import { InjectMode } from '../../source/enum/inject-mode';
import { InjectableDecorator } from '../../source/decorator/injectable-decorator';
import { InjectableSingletonDecorator } from '../../source/decorator/injectable-singleton-decorator';
import { Injection } from '../../source/injection/injection';
import { InjectionConstructor } from '../../source/type';

/**
 * Decorator.
 * Layers constructor with extends.
 * @param pConstructor - Constructor.
 */
const gPlaceholderDecorator = (pConstructor: InjectionConstructor): any => {
    // Layer constructor.
    return class extends pConstructor { constructor(...pArgs: Array<any>) { super(...pArgs); } };
};

describe('Injection', () => {
    describe('Static Method: createObject', () => {
        it('-- Not registered', () => {
            // Setup.
            class TestA { }

            // Process.
            const lThrows = () => {
                Injection.createObject(TestA);
            };

            // Evaluation.
            expect(lThrows).to.throw(`Constructor "${TestA.name}" is not registered for injection and can not be build`);
        });

        it('-- Default without parameter', () => {
            // Setup.
            @InjectableDecorator
            class TestA { }

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
        });

        it('-- Default with parameter', () => {
            // Setup.
            @InjectableDecorator
            class TestParameterA { }
            @InjectableDecorator
            class TestParameterB { }
            @InjectableDecorator
            class TestA { constructor(public mParameterA: TestParameterA, public mParameterB: TestParameterB) { } }

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).to.be.instanceOf(TestParameterB);
        });

        it('-- Default with parameter, parameter is singleton.', () => {
            // Setup.
            @InjectableDecorator
            class TestParameterA { }
            @InjectableSingletonDecorator
            class TestParameterB { }
            @InjectableDecorator
            class TestA { constructor(public mDefault: TestParameterA, public mSingleton: TestParameterB) { } }

            // Process.
            const lCreatedObjectOne: TestA = Injection.createObject(TestA);
            const lCreatedObjectTwo: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObjectOne.mDefault).to.be.instanceOf(TestParameterA);
            expect(lCreatedObjectOne.mSingleton).to.be.instanceOf(TestParameterB);
            expect(lCreatedObjectOne.mSingleton).to.equal(lCreatedObjectTwo.mSingleton);
        });

        it('-- Default with parameter, parameter not registered.', () => {
            // Setup.
            class TestParameter { }
            @InjectableDecorator
            class TestA { constructor(public mParameter: TestParameter) { } }

            // Process.
            const lThrows = () => {
                Injection.createObject(TestA);
            };

            // Evaluation.
            expect(lThrows).to.throw(`Parameter "${TestParameter.name}" of ${TestA.name} is not injectable.`);
        });

        it('-- Singleton without parameter', () => {
            // Setup.
            @InjectableSingletonDecorator
            class TestA { }

            // Process.
            const lCreatedObjectOne: TestA = Injection.createObject(TestA);
            const lCreatedObjectTwo: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObjectOne).to.be.instanceOf(TestA);
            expect(lCreatedObjectOne).to.equal(lCreatedObjectTwo);
        });

        it('-- Singleton with parameter', () => {
            // Setup.
            @InjectableDecorator
            class TestParameterA { }
            @InjectableDecorator
            class TestParameterB { }
            @InjectableSingletonDecorator
            class TestA { constructor(public mParameterA: TestParameterA, public mParameterB: TestParameterB) { } }

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).to.be.instanceOf(TestParameterB);
        });

        it('-- Singleton force create', () => {
            // Setup.
            @InjectableSingletonDecorator
            class TestA { }

            // Process.
            const lCreatedObjectOne: TestA = Injection.createObject(TestA);
            const lCreatedObjectTwo: TestA = Injection.createObject(TestA, true);

            // Evaluation.
            expect(lCreatedObjectTwo).to.be.instanceOf(TestA);
            expect(lCreatedObjectOne).to.not.equal(lCreatedObjectTwo);
        });

        it('-- Default with layered history', () => {
            // Setup.
            @InjectableDecorator
            @gPlaceholderDecorator
            class TestA { }
            @gPlaceholderDecorator
            @InjectableDecorator
            class TestB { }

            // Process.
            const lCreatedObjectA: TestA = Injection.createObject(TestA);
            const lCreatedObjectB: TestB = Injection.createObject(TestB);

            // Evaluation.
            expect(lCreatedObjectA).to.be.instanceOf(TestA);
            expect(lCreatedObjectB).to.be.instanceOf(TestB);
        });

        it('-- Default with layered history with parameter', () => {
            // Setup.
            @InjectableDecorator
            class TestParameterA { }
            @InjectableDecorator
            class TestParameterB { }
            @InjectableDecorator
            @gPlaceholderDecorator
            class TestA { constructor(public mParameterA: TestParameterA, public mParameterB: TestParameterB) { } }

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).to.be.instanceOf(TestParameterB);
        });

        it('-- Default with parameter with layered history', () => {
            // Setup.
            @InjectableDecorator
            @gPlaceholderDecorator
            class TestParameterA { }
            @InjectableDecorator
            class TestA { constructor(public mParameterA: TestParameterA) { } }

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
        });

        it('-- Default injection replacement without parameter', () => {
            // Setup.
            @InjectableDecorator
            class TestA { }
            @InjectableDecorator
            class ReplacementTestA { }

            // Setup. Set replacement.
            Injection.replaceInjectable(TestA, ReplacementTestA);

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(ReplacementTestA);
        });

        it('-- Default with parameter with injection replacement', () => {
            // Setup.
            @InjectableDecorator
            class TestParameterA { }
            @InjectableDecorator
            class ReplacementTestParameterA { }
            @InjectableDecorator
            class TestA { constructor(public mParameterA: TestParameterA) { } }

            // Setup. Set replacement.
            Injection.replaceInjectable(TestParameterA, ReplacementTestParameterA);

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(ReplacementTestParameterA);
        });

        it('-- Default injection replacement with layered history', () => {
            // Setup.
            @InjectableDecorator
            @gPlaceholderDecorator
            class TestA { }
            @InjectableDecorator
            @gPlaceholderDecorator
            class ReplacementTestA { }

            // Setup. Set replacement.
            Injection.replaceInjectable(TestA, ReplacementTestA);

            // Process.
            const lCreatedObjectA: TestA = Injection.createObject(TestA);

            // Evaluation.
            expect(lCreatedObjectA).to.be.instanceOf(ReplacementTestA);
        });

        it('-- Default with second layer local injection', () => {
            // Setup.
            @InjectableDecorator
            class TestParameterLayerTwo { }
            class TestParameterLayerTwoLocalInjection { }
            @InjectableDecorator
            class TestParameterLayerOne { constructor(public mParameter: TestParameterLayerTwo) { } }
            @InjectableDecorator
            class TestA { constructor(public mParameter: TestParameterLayerOne) { } }

            // Setup. Create local injection.
            const lLocalInjectionParameter: TestParameterLayerTwoLocalInjection = new TestParameterLayerTwoLocalInjection();
            const lLocalInjectionMap: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
            lLocalInjectionMap.add(TestParameterLayerTwo, lLocalInjectionParameter);

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA, lLocalInjectionMap);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameter).to.be.instanceOf(TestParameterLayerOne);
            expect(lCreatedObject.mParameter.mParameter).to.equal(lLocalInjectionParameter);
        });

        it('-- Default with local injection', () => {
            // Setup.
            @InjectableDecorator
            class TestParameter { }
            class TestParameterLocalInjection { }
            @InjectableSingletonDecorator
            class TestA { constructor(public mParameter: TestParameter) { } }

            // Setup. Create local injection.
            const lLocalInjectionParameter: TestParameterLocalInjection = new TestParameterLocalInjection();
            const lLocalInjectionMap: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
            lLocalInjectionMap.add(TestParameter, lLocalInjectionParameter);

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA, lLocalInjectionMap);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameter).to.not.equal(lLocalInjectionParameter);
            expect(lCreatedObject.mParameter).to.be.instanceOf(TestParameter);
        });

        it('-- Default with local injection with force', () => {
            // Setup.
            @InjectableDecorator
            class TestParameter { }
            class TestParameterLocalInjection { }
            @InjectableSingletonDecorator
            class TestA { constructor(public mParameter: TestParameter) { } }

            // Setup. Create local injection.
            const lLocalInjectionParameter: TestParameterLocalInjection = new TestParameterLocalInjection();
            const lLocalInjectionMap: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
            lLocalInjectionMap.add(TestParameter, lLocalInjectionParameter);

            // Process.
            const lCreatedObject: TestA = Injection.createObject(TestA, true, lLocalInjectionMap);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameter).to.equal(lLocalInjectionParameter);
        });
    });

    it('Static Method: registerInjectable', () => {
        // Setup.
        class Type { }

        // Process.
        Injection.registerInjectable(Type, InjectMode.Instanced);
        const lCreatedObject = Injection.createObject<Type>(Type);

        // Evaluation.
        expect(lCreatedObject).to.be.an.instanceOf(Type);
    });

    describe('Static Method: replaceInjectable', () => {
        it('-- Default', () => {
            // Setup. Types.
            class OriginalType { }
            class ReplacementType { }

            // Setup. Type with injected parameter.
            @InjectableDecorator
            class TestClass {
                public a: any;
                constructor(pType: OriginalType) {
                    this.a = pType;
                }
            }

            // Setup. Register injectable.
            Injection.registerInjectable(OriginalType, InjectMode.Instanced);
            Injection.registerInjectable(ReplacementType, InjectMode.Instanced);

            // Process.
            Injection.replaceInjectable(OriginalType, ReplacementType);
            const lCreatedObject = Injection.createObject<TestClass>(TestClass);

            // Evaluation.
            expect(lCreatedObject.a).to.be.an.instanceOf(ReplacementType);
        });

        it('-- Original not registerd', () => {
            // Setup. Types.
            class OriginalType { }
            class ReplacementType { }

            // Setup. Register injectable.
            Injection.registerInjectable(ReplacementType, InjectMode.Instanced);

            // Process.
            const lThrowErrorFunction = () => {
                Injection.replaceInjectable(OriginalType, ReplacementType);
            };

            // Evaluation.
            expect(lThrowErrorFunction).to.throw('Original constructor is not registered.');
        });

        it('-- Replacement not registerd', () => {
            // Setup. Types
            class OriginalType { }
            class ReplacementType { }

            // Setup. Register injectable.
            Injection.registerInjectable(OriginalType, InjectMode.Instanced);

            // Process.
            const lThrowErrorFunction = () => {
                Injection.replaceInjectable(OriginalType, ReplacementType);
            };

            // Evaluation.
            expect(lThrowErrorFunction).to.throw('Replacement constructor is not registered.');
        });
    });
});