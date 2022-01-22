export declare class ReflectInitialiser {
    private static mExported;
    /**
     * Initializes global defintions for decorate and metadata into the Reflect object.
     */
    static initialize(): void;
    /**
     * Decorate class or member.
     * @param pDecoratorList - List of decorators.
     * @param pTarget - Target for decorator.
     * @param pPropertyKey - Key of property on member decorator.
     * @param pAttributes - Descriptor of member on member decorator.
     */
    private static decorate;
    /**
     * Decorate class.
     * @param pDecoratorList - Decorators.
     * @param pConstructor - Target constructor.
     */
    private static decorateClass;
    /**
     * Decorate member.
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator.
     * @param pDescriptor - Descriptor of property
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
     * @param pKey - Key of metadata.
     * @param pValue - Value of metadata. Usually only "design:paramtypes" data.
     */
    private static metadata;
}
//# sourceMappingURL=reflect-initialiser.d.ts.map