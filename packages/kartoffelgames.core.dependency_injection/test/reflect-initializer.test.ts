import { expect } from 'chai';
import { Metadata } from '../source/metadata/metadata';
import { ReflectInitializer } from '../source/reflect/reflect-initializer';
import { InjectionConstructor } from '../source/type';

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
            const lMemberType: InjectionConstructor = Metadata.get(TestA).getProperty('property').type;

            // Process.
            expect(lMemberType).to.equal(String);
        });

        it('-- Function Parameter Type Metadata', () => {
            // Setup.
            class TestA {
                @gPlaceholderDecorator
                public function(_pFirst: number, _pSecond: string): string { return ''; }
            }

            // Process. Get type information.
            const lParameterTypeList: Array<InjectionConstructor> = Metadata.get(TestA).getProperty('function').parameterTypeList;

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
            const lResultType: InjectionConstructor = Metadata.get(TestA).getProperty('function').returnType;

            // Process.
            expect(lResultType).to.equal(String);
        });

        it('-- Constructor Parameter Type Metadata', () => {
            // Setup.
            @gPlaceholderDecorator
            class TestA {
                public constructor(_pFirst: string, pSecond: number) { /* Nothing */ }
            }

            // Process. Get type information.
            const lConstructorParameterTypeList: Array<InjectionConstructor> = Metadata.get(TestA).parameterTypeList;

            // Process.
            expect(lConstructorParameterTypeList).to.have.ordered.members([String, Number]);
        });

        it('-- Accessor Type Metadata', () => {
            // Setup.
            class TestA {
                @gPlaceholderDecorator
                public set value(_pNumber: number) { /* Nothing */ }
                public get value(): number { return null; }
            }

            // Process. Get type information.
            const lAccessorReturnType: InjectionConstructor = Metadata.get(TestA).getProperty('value').type;

            // Process.
            expect(lAccessorReturnType).to.equal(Number);
        });

        it('-- Accessor Parameter Type Metadata', () => {
            // Setup.
            class TestA {
                @gPlaceholderDecorator
                public set value(_pNumber: number) { /* Nothing */ }
                public get value(): number { return null; }
            }

            // Process. Get type information.
            const lAccessorParameterTypeList: Array<InjectionConstructor> = Metadata.get(TestA).getProperty('value').parameterTypeList;

            // Process.
            expect(lAccessorParameterTypeList).to.have.ordered.members([Number]);
        });
    });

    describe('Functionality: Decorate', () => {
        it('-- Decorate Constructor Keep Original', () => {
            // Setup. Create Decorator.
            const lPrototypeKey: string = 'prototypeKey';
            const lPrototypeValue: number = 11;
            const lDecorator = (pConstructor: InjectionConstructor) => {
                // Add prototype property value.
                pConstructor.prototype[lPrototypeKey] = lPrototypeValue;
            };

            // Setup.
            @lDecorator
            class TestA { }

            // Evaluation.
            expect(TestA.prototype).to.have.property(lPrototypeKey, lPrototypeValue);
        });

        it('-- Decorate Constructor Replace Original', () => {
            // Setup. Create Decorator.
            const lPrototypeKey: unique symbol = Symbol('prototypeKey');
            const lPrototypeValue: number = 11;
            const lDecorator = (pConstructor: InjectionConstructor) => {
                return class extends pConstructor {
                    public static [lPrototypeKey] = lPrototypeValue;
                };
            };

            // Setup.
            @lDecorator
            class TestA { }

            // Evaluation.
            expect(TestA).to.have.property(lPrototypeKey, lPrototypeValue);
        });

        it('-- Decorate Constructor Return Wrong Value', () => {
            // Setup. Create Decorator.
            const lDecorator = (_pPrototype: InjectionConstructor): any => {
                // Retun none constructor.
                return <any>11;
            };

            // Setup.
            const lThrowsErrorFunction = () => {
                @lDecorator
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                class TestA { }
            };

            // Evaluation.
            expect(lThrowsErrorFunction).to.throw('Constructor decorator does not return supported value.');
        });

        it('-- Decorate Property', () => {
            // Setup.
            const lPrototypeKey: unique symbol = Symbol('prototypeKey');

            // Setup.   
            let lResultParameterName: symbol;
            const lDecorator = (_pPrototype: object, pPropertyKey: symbol) => {
                lResultParameterName = pPropertyKey;
            };

            // Process.
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestA {
                @lDecorator
                public [lPrototypeKey]: number;
            }

            // Evaluation.
            expect(lResultParameterName).to.equal(lPrototypeKey);
        });

        it('-- Decorate Function Keep Original', () => {
            // Setup.   
            const lNewValue: number = 12;
            const lDecorator = (_pPrototype: object, pPropertyKey: string, pDescriptor: PropertyDescriptor) => {
                pDescriptor.value = lNewValue;
            };

            // Process.
            class TestA {
                @lDecorator
                public function(): void {/* Nothing */ }
            }

            // Evaluation.
            expect(TestA.prototype.function).to.equal(lNewValue);
        });

        it('-- Decorate Function Replace Original', () => {
            // Setup.   
            const lNewValue: number = 12;
            const lDecorator = (pPrototype: object, pPropertyKey: string, pDescriptor: PropertyDescriptor) => {
                const lDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(pPrototype, pPropertyKey);
                lDescriptor.value = () => {
                    return lNewValue;
                };

                return lDescriptor;
            };

            // Process.
            class TestA {
                @lDecorator
                public function(): number { return null; }
            }
            const lCreatedClass = new TestA();

            // Evaluation.
            expect(lCreatedClass.function()).to.equal(lNewValue);
        });

        it('-- Decorate Function Return Wrong Value', () => {
            // Setup.   
            const lDecorator = (_pPrototype: object, _pPropertyKey: string, _pDescriptor: PropertyDescriptor): any => {
                return 11;
            };

            // Process.
            const lThrowsErrorFunction = () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                class TestA {
                    @lDecorator
                    public function(): number { return null; }
                }
            };

            // Evaluation.
            expect(lThrowsErrorFunction).to.throw('Member decorator does not return supported value.');
        });

        it('-- Decorate Accessor Keep Original', () => {
            // Setup.   
            const lNewValue: number = 12;
            const lDecorator = (_pPrototype: object, pPropertyKey: string, pDescriptor: PropertyDescriptor) => {
                pDescriptor.get = () => {
                    return lNewValue;
                };
            };

            // Process. Create class and decorate accessor.
            class TestA {
                @lDecorator
                public set value(_pNumber: number) { /* Nothing */ }
                public get value(): number { return null; }
            }
            const lCreatedClass = new TestA();

            // Evaluation.
            expect(lCreatedClass.value).to.equal(lNewValue);
        });

        it('-- Decorate Accessor Replace Original', () => {
            // Setup.   
            const lNewValue: number = 12;
            const lDecorator = (pPrototype: object, pPropertyKey: string, pDescriptor: PropertyDescriptor) => {
                const lDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(pPrototype, pPropertyKey);
                lDescriptor.get = () => {
                    return lNewValue;
                };

                return lDescriptor;
            };

            // Process. Create class and decorate accessor.
            class TestA {
                @lDecorator
                public set value(_pNumber: number) { /* Nothing */ }
                public get value(): number { return null; }
            }
            const lCreatedClass = new TestA();

            // Evaluation.
            expect(lCreatedClass.value).to.equal(lNewValue);
        });

        it('-- Decorate Accessor Return Wrong Value', () => {
            // Setup.   
            const lDecorator = (_pPrototype: object, _pPropertyKey: string, _pDescriptor: PropertyDescriptor): any => {
                return 11;
            };

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const lThrowsErrorFunction = () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                class TestA {
                    @lDecorator
                    public set value(_pNumber: number) { /* Nothing */ }
                    public get value(): number { return null; }
                }
            };

            // Evaluation.
            expect(lThrowsErrorFunction).to.throw('Member decorator does not return supported value.');
        });

        it('-- Decorate Parameter', () => {
            // Process.   
            let lParameterIndex: number;
            const lDecorator = (_pPrototype: object, _pPropertyKey: string, pParameterIndex: number): any => {
                lParameterIndex = pParameterIndex;
            };

            // Process. Create class and decorate parameter.
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestA {
                public function(_pFirst: number, @lDecorator _pSecond: number): number { return null; }
            }

            // Evaluate.
            expect(lParameterIndex).to.equal(1);
        });

    });
});