import { Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';
import { DecorationHistory } from '../decoration-history/decoration-history';
import { Metadata } from '../metadata/metadata';
import { PropertyMetadata } from '../metadata/property-metadata';
import { ConstructorMetadata } from '../metadata/constructor-metadata';

export class ReflectInitializer {
    private static mExported: boolean = false;

    /**
     * Initializes global defintions for decorate and metadata into the Reflect object.
     */
    public static initialize(): void {
        if (!ReflectInitializer.mExported) {
            ReflectInitializer.mExported = true;

            ReflectInitializer.export('decorate', ReflectInitializer.decorate);
            ReflectInitializer.export('metadata', ReflectInitializer.metadata);
        }
    }

    /**
     * Decorate class, method, parameter or property.
     * @param pDecoratorList - List of decorators.
     * @param pTarget - Target for decorator.
     * @param pPropertyKey - Key of property on member decorator.
     * @param pDescriptor - Descriptor of member on member decorator.
     */
    private static decorate(pDecoratorList: Array<Decorator>, pTarget: any, pPropertyKey?: string | symbol, pDescriptor?: TypedPropertyDescriptor<any>): any {
        let lDecoratorResult: any;
        if (pPropertyKey && pDescriptor) {
            // Decorate accessor, function. Returns new descriptor.
            lDecoratorResult = ReflectInitializer.decorateMethod(<Array<MethodDecorator>>pDecoratorList, pTarget, pPropertyKey, pDescriptor);
        } else if (pPropertyKey && !pDescriptor) {
            // Decorate property or parameter. Has no return value.
            ReflectInitializer.decorateProperty(<Array<PropertyDecorator | ParameterDecorator>>pDecoratorList, pTarget, pPropertyKey);
            lDecoratorResult = null; // Is ignored.
        } else { // Only target set.
            // Decorate class. Returns replacement class.
            lDecoratorResult = ReflectInitializer.decorateClass(<Array<ClassDecorator>>pDecoratorList, <InjectionConstructor>pTarget);
        }

        return lDecoratorResult;
    }

    /**
     * Decorate class.
     * @param pDecoratorList - Decorators.
     * @param pConstructor - Target constructor.
     */
    private static decorateClass(pDecoratorList: Array<ClassDecorator>, pConstructor: InjectionConstructor): InjectionConstructor {
        let lCurrentConstrutor: InjectionConstructor = pConstructor;

        // Run all metadata decorator first.
        for (const lDecorator of pDecoratorList) {
            if ((<Decorator>lDecorator).isMetadata) {
                // Metadata decorator doesn't return values.
                lDecorator(pConstructor);
            }
        }

        // For each decorator included metadata decorator.
        for (const lDecorator of pDecoratorList) {
            // If the decorator was a metadata decorator use the original class as target.
            if (!(<Decorator>lDecorator).isMetadata) {
                // Execute decorator.
                const lNewConstructor = lDecorator(pConstructor);

                // Check if decorator does return different class.
                if (!!lNewConstructor && lNewConstructor !== lCurrentConstrutor) {
                    if (typeof lNewConstructor === 'function') {
                        // Add changed construtor to the decoration history.
                        DecorationHistory.addHistory(lCurrentConstrutor, lNewConstructor);
                        lCurrentConstrutor = lNewConstructor;
                    } else {
                        throw new Exception('Constructor decorator does not return supported value.', lDecorator);
                    }
                }
            }
        }

        return lCurrentConstrutor;
    }

    /**
     * Decorate method or accessor.
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator. 
     * @param pDescriptor - Descriptor of property
     */
    private static decorateMethod(pDecoratorList: Array<MethodDecorator>, pTarget: object, pPropertyKey: string | symbol, pDescriptor: TypedPropertyDescriptor<any> | undefined): PropertyDescriptor | undefined {
        let lCurrentDescriptor: TypedPropertyDescriptor<any> = <TypedPropertyDescriptor<any>>pDescriptor;

        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator.
            const lDecoratedMember = lDecorator(pTarget, pPropertyKey, lCurrentDescriptor);

            // Check if decorator does return different PropertyDescriptor.
            if (lDecoratedMember) {
                if (typeof lDecoratedMember === 'object') {
                    lCurrentDescriptor = lDecoratedMember;
                } else {
                    throw new Exception('Member decorator does not return supported value.', lDecorator);
                }
            }
        }

        return lCurrentDescriptor;
    }

    /**
     * Decorate property or parameter..
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator. 
     */
    private static decorateProperty(pDecoratorList: Array<PropertyDecorator | ParameterDecorator>, pTarget: object, pPropertyKey: string | symbol): void {
        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator. Doesn't return any value.
            lDecorator(pTarget, pPropertyKey, <any>undefined); // Index number gets overriden for parameter decorator.
        }
    }

    /**
     * Export property into Reflect object.
     * @param pKey - Key of property.
     * @param pValue - Value of property.
     */
    private static export<T>(pKey: string, pValue: T) {
        // Find root for accessing Reflect.
        /* istanbul ignore next */
        const lRoot: any = typeof window === 'object' ? window : global;

        // Set target as Reflect of root. (window or global).
        const lTarget: typeof Reflect = lRoot.Reflect;

        Object.defineProperty(lTarget, pKey, { configurable: true, writable: true, value: pValue });
    }

    /**
     * Get constructor from prototype.
     * @param pPrototypeOrConstructor - Prototype or constructor of class.
     */
    private static getConstructor(pPrototypeOrConstructor: InjectionConstructor | object): InjectionConstructor {
        // Get constructor from prototype if is an instanced member.
        if (typeof pPrototypeOrConstructor !== 'function') {
            return <InjectionConstructor>(<object>pPrototypeOrConstructor).constructor;
        } else {
            return <InjectionConstructor>pPrototypeOrConstructor;
        }
    }

    /**
     * Entry point for Typescripts emitDecoratorMetadata data. 
     * @param pMetadataKey - Key of metadata.
     * @param pMetadataValue - Value of metadata. Usually only "design:paramtypes" data.
     */
    private static metadata(pMetadataKey: string, pMetadataValue: Array<InjectionConstructor> | InjectionConstructor): Decorator {
        /*
           __metadata("design:type", Function), // Parameter Value
           __metadata("design:paramtypes", [Number, String]), // Function or Constructor Parameter
           __metadata("design:returntype", void 0) // Function return type.
        */
        const lResultDecorator: Decorator = (pConstructorOrPrototype: object, pProperty?: string | symbol, pDescriptorOrIndex?: PropertyDescriptor | number): void => {
            // Get constructor from prototype if is an instanced member.
            const lConstructor: InjectionConstructor = ReflectInitializer.getConstructor(pConstructorOrPrototype);
            const lConstructorMetadata: ConstructorMetadata = Metadata.get(lConstructor);

            if (pProperty) {
                const lPropertyMetadata: PropertyMetadata = lConstructorMetadata.getProperty(pProperty);

                // If not parameter index.
                /* istanbul ignore else */
                if (typeof pDescriptorOrIndex !== 'number') {
                    // Property decorator.
                    /* istanbul ignore else */
                    if (pMetadataKey === 'design:paramtypes') {
                        lPropertyMetadata.parameterTypes = <Array<InjectionConstructor>>pMetadataValue;
                    } else if (pMetadataKey === 'design:type') {
                        lPropertyMetadata.type = <InjectionConstructor>pMetadataValue;
                    } else if (pMetadataKey === 'design:returntype') {
                        lPropertyMetadata.returnType = <InjectionConstructor>pMetadataValue;
                    }
                    // Ignore future metadata.
                }
                // Else. Parameter decorator.
                // Ignore else case. Not supported.
            } else {
                // Class decorator.
                /* istanbul ignore else */
                if (pMetadataKey === 'design:paramtypes') {
                    lConstructorMetadata.parameterTypeList = <Array<InjectionConstructor>>pMetadataValue;
                }
                // Ignore future metadata.
            }
        };

        // Set as metadata constructor and return.
        lResultDecorator.isMetadata = true;
        return lResultDecorator;
    }
}

/**
 * Allround decorator with custom isMetadata property.
 */
type Decorator = (ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator) & { isMetadata: boolean; };

