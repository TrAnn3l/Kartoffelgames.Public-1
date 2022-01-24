import { Exception } from '@kartoffelgames/core.data';
import { MemberType } from '../enum/member-type';
import { InjectionConstructor } from '../type';
import { TypeRegister } from '../type_register/type-register';
import { DecorationHistory } from './decoration-history';

type MemberDecorator = <T>(pTarget: object, pPropertyKey: string | symbol, pDescriptor?: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | undefined;

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
     * Decorate class or member.
     * @param pDecoratorList - List of decorators.
     * @param pTarget - Target for decorator.
     * @param pPropertyKey - Key of property on member decorator.
     * @param pAttributes - Descriptor of member on member decorator.
     */
    private static decorate(pDecoratorList: Array<ClassDecorator | MemberDecorator>, pTarget: any, pPropertyKey?: string | symbol, pAttributes?: PropertyDescriptor | null): any {
        // Check if target is a property or a class.
        if (typeof pPropertyKey !== 'undefined') {
            return ReflectInitializer.decorateProperty(<Array<MemberDecorator>>pDecoratorList, pTarget, pPropertyKey, pAttributes);
        }
        else {
            return ReflectInitializer.decorateClass(<Array<ClassDecorator>>pDecoratorList, <InjectionConstructor>pTarget);
        }
    }

    /**
     * Decorate class.
     * @param pDecoratorList - Decorators.
     * @param pConstructor - Target constructor.
     */
    private static decorateClass(pDecoratorList: Array<ClassDecorator>, pConstructor: InjectionConstructor): InjectionConstructor {
        const lMetadataDecoratorList: Array<ClassDecorator> = new Array<ClassDecorator>();
        let lCurrentConstrutor: InjectionConstructor = pConstructor;

        // For each decorator included metadata decorator.
        for (const lDecorator of pDecoratorList) {
            // If the decorator was a metadata decorator use the original class as target..
            if ('isMetadata' in (<any>lDecorator) && (<any>lDecorator).isMetadata === true) {
                lMetadataDecoratorList.push(lDecorator);
            } else {
                // Execute decorator.
                const lDecoratedClass = lDecorator(pConstructor);

                // Check if decorator does return different class.
                if (typeof lDecoratedClass !== 'undefined' && lDecoratedClass !== null && pConstructor !== lDecoratedClass) {
                    if (typeof lDecoratedClass === 'function') {
                        // Add changed construtor to the decoration history.
                        const lNextConstructor: InjectionConstructor = <InjectionConstructor>lDecoratedClass;
                        DecorationHistory.addHistory(lCurrentConstrutor, lNextConstructor);

                        lCurrentConstrutor = lNextConstructor;
                    } else {
                        throw new Exception('Constructor decorator does not return supported value.', lDecorator);
                    }
                }
            }
        }

        // Apply metadata on original decorated constructor.
        // Should typescript do automaticly, but just in case.  
        for (const lMetadataDecorator of lMetadataDecoratorList) {
            lMetadataDecorator(pConstructor);
        }

        return lCurrentConstrutor;
    }

    /**
     * Decorate member.
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator. 
     * @param pDescriptor - Descriptor of property
     */
    private static decorateProperty(pDecoratorList: Array<MemberDecorator>, pTarget: object, pPropertyKey: string | symbol, pDescriptor: PropertyDescriptor | undefined): PropertyDescriptor | undefined {
        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator.
            const lDecoratedMember = lDecorator(pTarget, pPropertyKey, pDescriptor);

            // Check if decorator does return different PropertyDescriptor.
            if (typeof lDecoratedMember !== 'undefined' && lDecoratedMember !== null) {
                if (typeof lDecoratedMember === 'object') {
                    pDescriptor = <PropertyDescriptor>lDecoratedMember;
                } else {
                    throw new Exception('Member decorator does not return supported value.', lDecorator);
                }
            }
        }

        return pDescriptor;
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
     * @param pKey - Key of metadata.
     * @param pValue - Value of metadata. Usually only "design:paramtypes" data.
     */
    private static metadata(pKey: string, pValue: Array<InjectionConstructor> | InjectionConstructor): (pConstructor: InjectionConstructor) => InjectionConstructor | PropertyDescriptor {
        let lResultDecorator: (pConstructor: InjectionConstructor) => InjectionConstructor | PropertyDescriptor;

        /**
           __metadata("design:type", Function),
           __metadata("design:paramtypes", []),
           __metadata("design:returntype", void 0)
        */

        if (pKey === 'design:paramtypes') {
            const lTypeValues: Array<InjectionConstructor> = <Array<InjectionConstructor>>pValue;

            // Decorator. Adds type metadata to constructor or member.
            lResultDecorator = (pConstructor: InjectionConstructor | object, pPropertyKey?: string): InjectionConstructor | PropertyDescriptor => {
                // Get constructor from prototype if is an instanced member.
                const lConstructor: InjectionConstructor = ReflectInitializer.getConstructor(pConstructor);

                // Check if types are for constructor or for member.
                if (typeof pPropertyKey === 'undefined') {
                    const lTypeValueArrayCopy: Array<InjectionConstructor> = new Array<InjectionConstructor>();
                    lTypeValueArrayCopy.push(...lTypeValues);

                    TypeRegister.setConstructorTypes(lConstructor, lTypeValueArrayCopy);
                } else {
                    TypeRegister.setMemberTypes(lConstructor, pPropertyKey, MemberType.Parameter, ...lTypeValues);
                }

                return undefined;
            };
        } else if (pKey === 'design:type') {
            const lTypeValues: InjectionConstructor = <InjectionConstructor>pValue;

            // Add member type
            lResultDecorator = (pConstructor: InjectionConstructor | object, pPropertyKey?: string | symbol, pDescriptor?: TypedPropertyDescriptor<any>): PropertyDescriptor => {
                // Get constructor from prototype if is an instanced member.
                const lConstructor: InjectionConstructor = ReflectInitializer.getConstructor(pConstructor);

                // Set member type.
                TypeRegister.setMemberTypes(lConstructor, pPropertyKey, MemberType.Member, lTypeValues);
                return undefined;
            };
        } else if (pKey === 'design:returntype') {
            const lTypeValues: InjectionConstructor = <InjectionConstructor>pValue;

            // Add member type
            lResultDecorator = (pConstructor: InjectionConstructor | object, pPropertyKey?: string | symbol, pDescriptor?: TypedPropertyDescriptor<any>): PropertyDescriptor => {
                // Get constructor from prototype if is an instanced member.
                const lConstructor: InjectionConstructor = ReflectInitializer.getConstructor(pConstructor);

                // Set result type of function.
                TypeRegister.setMemberTypes(lConstructor, pPropertyKey, MemberType.Result, lTypeValues);
                return undefined;
            };
        } else {
            // Dummy decorator. Does nothing. For future releases.
            lResultDecorator = (pConstructor: InjectionConstructor, pPropertyKey?: string | symbol, pDescriptor?: TypedPropertyDescriptor<any>): PropertyDescriptor | InjectionConstructor => {
                return undefined;
            };
        }

        // Add metadata flag for the detect metadata decorator.
        (<any>lResultDecorator).isMetadata = true;

        return lResultDecorator;
    }
}
