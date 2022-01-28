export declare class ReflectInitializer {
    private static mExported;
    /**
     * Initializes global defintions for decorate and metadata into the Reflect object.
     */
    static initialize(): void;
    /**
     * Decorate class, method, parameter or property.
     * @param pDecoratorList - List of decorators.
     * @param pTarget - Target for decorator.
     * @param pPropertyKey - Key of property on member decorator.
     * @param pDescriptor - Descriptor of member on member decorator.
     */
    private static decorate;
    /**
     * Decorate class.
     * @param pDecoratorList - Decorators.
     * @param pConstructor - Target constructor.
     */
    private static decorateClass;
    /**
     * Decorate method or accessor.
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator.
     * @param pDescriptor - Descriptor of property
     */
    private static decorateMethod;
    /**
     * Decorate property or parameter..
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator.
     */
    private static decorateProperty;
    /**
     * Export property into Reflect object.
     * @param pKey - Key of property.
     * @param pValue - Value of property.
     */
    private static export;
    /**
     * Get constructor from prototype.
     * @param pPrototypeOrConstructor - Prototype or constructor of class.
     */
    private static getConstructor;
    /**
     * Entry point for Typescripts emitDecoratorMetadata data.
     * @param pMetadataKey - Key of metadata.
     * @param pMetadataValue - Value of metadata. Usually only "design:paramtypes" data.
     */
    private static metadata;
}
//# sourceMappingURL=reflect-initializer.d.ts.map