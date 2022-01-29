import { Dictionary } from '@kartoffelgames/core.data';
import { expect } from 'chai';
import { InjectMode } from '../../source/enum/inject-mode';
import { Injectable } from '../../source/injection/injectable';
import { InjectableSingleton } from '../../source/injection/injectable-singleton';
import { InjectionRegister } from '../../source/injection/injection-register';
import { Injector } from '../../source/injector';
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

describe('InjectionRegister', () => {
    describe('Static Method: createObject', () => {
        it('-- Not registered', () => {
            // Setup.
            class TestA { }

            // Process.
            const lThrows = () => {
                InjectionRegister.createObject(TestA);
            };

            // Evaluation.
            expect(lThrows).to.throw(`Constructor "${TestA.name}" is not registered for injection and can not be build`);
        });

        it('-- Default without parameter', () => {
            // Setup.
            @Injectable
            class TestA { }

            // Process.
            const lCreatedObject: TestA = InjectionRegister.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
        });

        it('-- Default with parameter', () => {
            // Setup.
            @Injectable
            class TestParameterA { }
            @Injectable
            class TestParameterB { }
            @Injectable
            class TestA { constructor(public mParameterA: TestParameterA, public mParameterB: TestParameterB) { } }

            // Process.
            const lCreatedObject: TestA = InjectionRegister.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).to.be.instanceOf(TestParameterB);
        });

        it('-- Default with parameter, parameter is singleton.', () => {
            // Setup.
            @Injectable
            class TestParameterA { }
            @InjectableSingleton
            class TestParameterB { }
            @Injectable
            class TestA { constructor(public mDefault: TestParameterA, public mSingleton: TestParameterB) { } }

            // Process.
            const lCreatedObjectOne: TestA = InjectionRegister.createObject(TestA);
            const lCreatedObjectTwo: TestA = InjectionRegister.createObject(TestA);

            // Evaluation.
            expect(lCreatedObjectOne.mDefault).to.be.instanceOf(TestParameterA);
            expect(lCreatedObjectOne.mSingleton).to.be.instanceOf(TestParameterB);
            expect(lCreatedObjectOne.mSingleton).to.equal(lCreatedObjectTwo.mSingleton);
        });

        it('-- Default with parameter, parameter not registered.', () => {
            // Setup.
            class TestParameter { }
            @Injectable
            class TestA { constructor(public mParameter: TestParameter) { } }

            // Process.
            const lThrows = () => {
                InjectionRegister.createObject(TestA);
            };

            // Evaluation.
            expect(lThrows).to.throw(`Parameter "${TestParameter.name}" of ${TestA.name} is not injectable.`);
        });

        it('-- Singleton without parameter', () => {
            // Setup.
            @InjectableSingleton
            class TestA { }

            // Process.
            const lCreatedObjectOne: TestA = InjectionRegister.createObject(TestA);
            const lCreatedObjectTwo: TestA = InjectionRegister.createObject(TestA);

            // Evaluation.
            expect(lCreatedObjectOne).to.be.instanceOf(TestA);
            expect(lCreatedObjectOne).to.equal(lCreatedObjectTwo);
        });

        it('-- Singleton with parameter', () => {
            // Setup.
            @Injectable
            class TestParameterA { }
            @Injectable
            class TestParameterB { }
            @InjectableSingleton
            class TestA { constructor(public mParameterA: TestParameterA, public mParameterB: TestParameterB) { } }

            // Process.
            const lCreatedObject: TestA = InjectionRegister.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).to.be.instanceOf(TestParameterB);
        });

        it('-- Singleton force create', () => {
            // Setup.
            @InjectableSingleton
            class TestA { }

            // Process.
            const lCreatedObjectOne: TestA = InjectionRegister.createObject(TestA);
            const lCreatedObjectTwo: TestA = InjectionRegister.createObject(TestA, true);

            // Evaluation.
            expect(lCreatedObjectTwo).to.be.instanceOf(TestA);
            expect(lCreatedObjectOne).to.not.equal(lCreatedObjectTwo);
        });

        it('-- Default with layered history', () => {
            // Setup.
            @Injectable
            @gPlaceholderDecorator
            class TestA { }
            @gPlaceholderDecorator
            @Injectable
            class TestB { }

            // Process.
            const lCreatedObjectA: TestA = InjectionRegister.createObject(TestA);
            const lCreatedObjectB: TestB = InjectionRegister.createObject(TestB);

            // Evaluation.
            expect(lCreatedObjectA).to.be.instanceOf(TestA);
            expect(lCreatedObjectB).to.be.instanceOf(TestB);
        });

        it('-- Default with layered history with parameter', () => {
            // Setup.
            @Injectable
            class TestParameterA { }
            @Injectable
            class TestParameterB { }
            @Injectable
            @gPlaceholderDecorator
            class TestA { constructor(public mParameterA: TestParameterA, public mParameterB: TestParameterB) { } }

            // Process.
            const lCreatedObject: TestA = InjectionRegister.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
            expect(lCreatedObject.mParameterB).to.be.instanceOf(TestParameterB);
        });

        it('-- Default with parameter with layered history', () => {
            // Setup.
            @Injectable
            @gPlaceholderDecorator
            class TestParameterA { }
            @Injectable
            class TestA { constructor(public mParameterA: TestParameterA) { } }

            // Process.
            const lCreatedObject: TestA = InjectionRegister.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(TestParameterA);
        });

        it('-- Default injection replacement without parameter', () => {
            // Setup.
            @Injectable
            class TestA { }
            @Injectable
            class ReplacementTestA { }

            // Setup. Set replacement.
            InjectionRegister.replaceInjectable(TestA, ReplacementTestA);

            // Process.
            const lCreatedObject: TestA = InjectionRegister.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(ReplacementTestA);
        });

        it('-- Default with parameter with injection replacement', () => {
            // Setup.
            @Injectable
            class TestParameterA { }
            @Injectable
            class ReplacementTestParameterA { }
            @Injectable
            class TestA { constructor(public mParameterA: TestParameterA) { } }

            // Setup. Set replacement.
            InjectionRegister.replaceInjectable(TestParameterA, ReplacementTestParameterA);

            // Process.
            const lCreatedObject: TestA = InjectionRegister.createObject(TestA);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameterA).to.be.instanceOf(ReplacementTestParameterA);
        });

        it('-- Default injection replacement with layered history', () => {
            // Setup.
            @Injectable
            @gPlaceholderDecorator
            class TestA { }
            @Injectable
            @gPlaceholderDecorator
            class ReplacementTestA { }

            // Setup. Set replacement.
            InjectionRegister.replaceInjectable(TestA, ReplacementTestA);

            // Process.
            const lCreatedObjectA: TestA = InjectionRegister.createObject(TestA);

            // Evaluation.
            expect(lCreatedObjectA).to.be.instanceOf(ReplacementTestA);
        });

        it('-- Default with second layer local injection', () => {
            // Setup.
            @Injectable
            class TestParameterLayerTwo { }
            class TestParameterLayerTwoLocalInjection { }
            @Injectable
            class TestParameterLayerOne { constructor(public mParameter: TestParameterLayerTwo) { } }
            @Injectable
            class TestA { constructor(public mParameter: TestParameterLayerOne) { } }

            // Setup. Create local injection.
            const lLocalInjectionParameter: TestParameterLayerTwoLocalInjection = new TestParameterLayerTwoLocalInjection();
            const lLocalInjectionMap: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
            lLocalInjectionMap.add(TestParameterLayerTwo, lLocalInjectionParameter);

            // Process.
            const lCreatedObject: TestA = InjectionRegister.createObject(TestA, lLocalInjectionMap);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameter).to.be.instanceOf(TestParameterLayerOne);
            expect(lCreatedObject.mParameter.mParameter).to.equal(lLocalInjectionParameter);
        });

        it('-- Default with local injection', () => {
            // Setup.
            @Injectable
            class TestParameter { }
            class TestParameterLocalInjection { }
            @InjectableSingleton
            class TestA { constructor(public mParameter: TestParameter) { } }

            // Setup. Create local injection.
            const lLocalInjectionParameter: TestParameterLocalInjection = new TestParameterLocalInjection();
            const lLocalInjectionMap: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
            lLocalInjectionMap.add(TestParameter, lLocalInjectionParameter);

            // Process.
            const lCreatedObject: TestA = InjectionRegister.createObject(TestA, lLocalInjectionMap);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameter).to.not.equal(lLocalInjectionParameter);
            expect(lCreatedObject.mParameter).to.be.instanceOf(TestParameter);
        });

        it('-- Default with local injection with force', () => {
            // Setup.
            @Injectable
            class TestParameter { }
            class TestParameterLocalInjection { }
            @InjectableSingleton
            class TestA { constructor(public mParameter: TestParameter) { } }

            // Setup. Create local injection.
            const lLocalInjectionParameter: TestParameterLocalInjection = new TestParameterLocalInjection();
            const lLocalInjectionMap: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
            lLocalInjectionMap.add(TestParameter, lLocalInjectionParameter);

            // Process.
            const lCreatedObject: TestA = InjectionRegister.createObject(TestA, true, lLocalInjectionMap);

            // Evaluation.
            expect(lCreatedObject).to.be.instanceOf(TestA);
            expect(lCreatedObject.mParameter).to.equal(lLocalInjectionParameter);
        });
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

        it('-- Replacement not registerd', () => {
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