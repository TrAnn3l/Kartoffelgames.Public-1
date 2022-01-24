"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectInitializer = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const member_type_1 = require("../enum/member-type");
const type_register_1 = require("../type_register/type-register");
const decoration_history_1 = require("./decoration-history");
class ReflectInitializer {
    /**
     * Initializes global defintions for decorate and metadata into the Reflect object.
     */
    static initialize() {
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
    static decorate(pDecoratorList, pTarget, pPropertyKey, pAttributes) {
        // Check if target is a property or a class.
        if (typeof pPropertyKey !== 'undefined') {
            return ReflectInitializer.decorateProperty(pDecoratorList, pTarget, pPropertyKey, pAttributes);
        }
        else {
            return ReflectInitializer.decorateClass(pDecoratorList, pTarget);
        }
    }
    /**
     * Decorate class.
     * @param pDecoratorList - Decorators.
     * @param pConstructor - Target constructor.
     */
    static decorateClass(pDecoratorList, pConstructor) {
        const lMetadataDecoratorList = new Array();
        let lCurrentConstrutor = pConstructor;
        // For each decorator included metadata decorator.
        for (const lDecorator of pDecoratorList) {
            // If the decorator was a metadata decorator use the original class as target..
            if ('isMetadata' in lDecorator && lDecorator.isMetadata === true) {
                lMetadataDecoratorList.push(lDecorator);
            }
            else {
                // Execute decorator.
                const lDecoratedClass = lDecorator(pConstructor);
                // Check if decorator does return different class.
                if (typeof lDecoratedClass !== 'undefined' && lDecoratedClass !== null && pConstructor !== lDecoratedClass) {
                    if (typeof lDecoratedClass === 'function') {
                        // Add changed construtor to the decoration history.
                        const lNextConstructor = lDecoratedClass;
                        decoration_history_1.DecorationHistory.addHistory(lCurrentConstrutor, lNextConstructor);
                        lCurrentConstrutor = lNextConstructor;
                    }
                    else {
                        throw new core_data_1.Exception('Constructor decorator does not return supported value.', lDecorator);
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
    static decorateProperty(pDecoratorList, pTarget, pPropertyKey, pDescriptor) {
        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator.
            const lDecoratedMember = lDecorator(pTarget, pPropertyKey, pDescriptor);
            // Check if decorator does return different PropertyDescriptor.
            if (typeof lDecoratedMember !== 'undefined' && lDecoratedMember !== null) {
                if (typeof lDecoratedMember === 'object') {
                    pDescriptor = lDecoratedMember;
                }
                else {
                    throw new core_data_1.Exception('Member decorator does not return supported value.', lDecorator);
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
    static export(pKey, pValue) {
        // Find root for accessing Reflect.
        /* istanbul ignore next */
        const lRoot = typeof window === 'object' ? window : global;
        // Set target as Reflect of root. (window or global).
        const lTarget = lRoot.Reflect;
        Object.defineProperty(lTarget, pKey, { configurable: true, writable: true, value: pValue });
    }
    /**
     * Get constructor from prototype.
     * @param pPrototypeOrConstructor - Prototype or constructor of class.
     */
    static getConstructor(pPrototypeOrConstructor) {
        // Get constructor from prototype if is an instanced member.
        if (typeof pPrototypeOrConstructor !== 'function') {
            return pPrototypeOrConstructor.constructor;
        }
        else {
            return pPrototypeOrConstructor;
        }
    }
    /**
     * Entry point for Typescripts emitDecoratorMetadata data.
     * @param pKey - Key of metadata.
     * @param pValue - Value of metadata. Usually only "design:paramtypes" data.
     */
    static metadata(pKey, pValue) {
        let lResultDecorator;
        /**
           __metadata("design:type", Function),
           __metadata("design:paramtypes", []),
           __metadata("design:returntype", void 0)
        */
        if (pKey === 'design:paramtypes') {
            const lTypeValues = pValue;
            // Decorator. Adds type metadata to constructor or member.
            lResultDecorator = (pConstructor, pPropertyKey) => {
                // Get constructor from prototype if is an instanced member.
                const lConstructor = ReflectInitializer.getConstructor(pConstructor);
                // Check if types are for constructor or for member.
                if (typeof pPropertyKey === 'undefined') {
                    const lTypeValueArrayCopy = new Array();
                    lTypeValueArrayCopy.push(...lTypeValues);
                    type_register_1.TypeRegister.setConstructorTypes(lConstructor, lTypeValueArrayCopy);
                }
                else {
                    type_register_1.TypeRegister.setMemberTypes(lConstructor, pPropertyKey, member_type_1.MemberType.Parameter, ...lTypeValues);
                }
                return undefined;
            };
        }
        else if (pKey === 'design:type') {
            const lTypeValues = pValue;
            // Add member type
            lResultDecorator = (pConstructor, pPropertyKey, pDescriptor) => {
                // Get constructor from prototype if is an instanced member.
                const lConstructor = ReflectInitializer.getConstructor(pConstructor);
                // Set member type.
                type_register_1.TypeRegister.setMemberTypes(lConstructor, pPropertyKey, member_type_1.MemberType.Member, lTypeValues);
                return undefined;
            };
        }
        else if (pKey === 'design:returntype') {
            const lTypeValues = pValue;
            // Add member type
            lResultDecorator = (pConstructor, pPropertyKey, pDescriptor) => {
                // Get constructor from prototype if is an instanced member.
                const lConstructor = ReflectInitializer.getConstructor(pConstructor);
                // Set result type of function.
                type_register_1.TypeRegister.setMemberTypes(lConstructor, pPropertyKey, member_type_1.MemberType.Result, lTypeValues);
                return undefined;
            };
        }
        else {
            // Dummy decorator. Does nothing. For future releases.
            lResultDecorator = (pConstructor, pPropertyKey, pDescriptor) => {
                return undefined;
            };
        }
        // Add metadata flag for the detect metadata decorator.
        lResultDecorator.isMetadata = true;
        return lResultDecorator;
    }
}
exports.ReflectInitializer = ReflectInitializer;
ReflectInitializer.mExported = false;
//# sourceMappingURL=reflect-initializer.js.map