"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectInitializer = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const decoration_history_1 = require("./decoration-history");
const metadata_1 = require("../metadata/metadata");
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
     * Decorate class, method, parameter or property.
     * @param pDecoratorList - List of decorators.
     * @param pTarget - Target for decorator.
     * @param pPropertyKey - Key of property on member decorator.
     * @param pDescriptor - Descriptor of member on member decorator.
     */
    static decorate(pDecoratorList, pTarget, pPropertyKey, pDescriptor) {
        let lDecoratorResult;
        if (pPropertyKey && pDescriptor) {
            // Decorate accessor, function. Returns new descriptor.
            lDecoratorResult = ReflectInitializer.decorateMethod(pDecoratorList, pTarget, pPropertyKey, pDescriptor);
        }
        else if (pPropertyKey && !pDescriptor) {
            // Decorate property pr parameter. Has no return value.
            ReflectInitializer.decorateProperty(pDecoratorList, pTarget, pPropertyKey);
            lDecoratorResult = null; // Is ignored.
        }
        else { // Only target set.
            // Decorate class. Returns replacement class.
            lDecoratorResult = ReflectInitializer.decorateClass(pDecoratorList, pTarget);
        }
        return lDecoratorResult;
    }
    /**
     * Decorate class.
     * @param pDecoratorList - Decorators.
     * @param pConstructor - Target constructor.
     */
    static decorateClass(pDecoratorList, pConstructor) {
        let lCurrentConstrutor = pConstructor;
        // Run all metadata decorator first.
        for (const lDecorator of pDecoratorList) {
            if (lDecorator.isMetadata) {
                // Metadata decorator doesn't return values.
                lDecorator(pConstructor);
            }
        }
        // For each decorator included metadata decorator.
        for (const lDecorator of pDecoratorList) {
            // If the decorator was a metadata decorator use the original class as target.
            if (!lDecorator.isMetadata) {
                // Execute decorator.
                const lNewConstructor = lDecorator(pConstructor);
                // Check if decorator does return different class.
                if (!!lNewConstructor && lNewConstructor !== lCurrentConstrutor) {
                    if (typeof lNewConstructor === 'function') {
                        // Add changed construtor to the decoration history.
                        decoration_history_1.DecorationHistory.addHistory(lCurrentConstrutor, lNewConstructor);
                        lCurrentConstrutor = lNewConstructor;
                    }
                    else {
                        throw new core_data_1.Exception('Constructor decorator does not return supported value.', lDecorator);
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
    static decorateMethod(pDecoratorList, pTarget, pPropertyKey, pDescriptor) {
        let lCurrentDescriptor = pDescriptor;
        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator.
            const lDecoratedMember = lDecorator(pTarget, pPropertyKey, lCurrentDescriptor);
            // Check if decorator does return different PropertyDescriptor.
            if (lDecoratedMember) {
                if (typeof lDecoratedMember === 'object') {
                    lCurrentDescriptor = lDecoratedMember;
                }
                else {
                    throw new core_data_1.Exception('Member decorator does not return supported value.', lDecorator);
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
    static decorateProperty(pDecoratorList, pTarget, pPropertyKey) {
        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator. Doesn't return any value.
            lDecorator(pTarget, pPropertyKey);
        }
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
     * @param pMetadataKey - Key of metadata.
     * @param pMetadataValue - Value of metadata. Usually only "design:paramtypes" data.
     */
    static metadata(pMetadataKey, pMetadataValue) {
        /*
           __metadata("design:type", Function), // Parameter Value
           __metadata("design:paramtypes", [Number, String]), // Function or Constructor Parameter
           __metadata("design:returntype", void 0) // Function return type.
        */
        const lResultDecorator = (pConstructorOrPrototype, pProperty, pDescriptorOrIndex) => {
            // Get constructor from prototype if is an instanced member.
            const lConstructor = ReflectInitializer.getConstructor(pConstructorOrPrototype);
            const lConstructorMetadata = metadata_1.Metadata.get(lConstructor);
            if (pProperty) {
                const lPropertyMetadata = lConstructorMetadata.getProperty(pProperty);
                // If not parameter index.
                /* istanbul ignore else */
                if (typeof pDescriptorOrIndex !== 'number') {
                    // Property decorator.
                    /* istanbul ignore else */
                    if (pMetadataKey === 'design:paramtypes') {
                        lPropertyMetadata.parameterTypes = pMetadataValue;
                    }
                    else if (pMetadataKey === 'design:type') {
                        lPropertyMetadata.type = pMetadataValue;
                    }
                    else if (pMetadataKey === 'design:returntype') {
                        lPropertyMetadata.returnType = pMetadataValue;
                    }
                    // Ignore future metadata.
                }
                // Else. Parameter decorator.
                // Ignore else case. Not supported.
            }
            else {
                // Class decorator.
                /* istanbul ignore else */
                if (pMetadataKey === 'design:paramtypes') {
                    lConstructorMetadata.parameterTypes = pMetadataValue;
                }
                // Ignore future metadata.
            }
        };
        // Set as metadata constructor and return.
        lResultDecorator.isMetadata = true;
        return lResultDecorator;
    }
}
exports.ReflectInitializer = ReflectInitializer;
ReflectInitializer.mExported = false;
//# sourceMappingURL=reflect-initializer.js.map