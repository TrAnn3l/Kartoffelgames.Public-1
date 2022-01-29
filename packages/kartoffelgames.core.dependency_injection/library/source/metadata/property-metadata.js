"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyMetadata = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
class PropertyMetadata {
    /**
     * Constructor.
     * Initialize lists.
     */
    constructor() {
        this.mCustomMetadata = new core_data_1.Dictionary();
    }
    /**
     * Get parameter type information.
     */
    get parameterTypeList() {
        return this.mParameterTypes ?? null;
    }
    /**
     * Set parameter type information.
     */
    set parameterTypeList(pParameterTypes) {
        // Copy array.
        this.mParameterTypes = core_data_1.List.newListWith(...pParameterTypes);
    }
    /**
     * Get return type information.
     */
    get returnType() {
        return this.mReturnType ?? null;
    }
    /**
     * Set return type information.
     */
    set returnType(pReturnType) {
        this.mReturnType = pReturnType;
    }
    /**
     * Get property type information.
     */
    get type() {
        return this.mType ?? null;
    }
    /**
     * Set property type information.
     */
    set type(pReturnType) {
        this.mType = pReturnType;
    }
    /**
     * Get metadata of constructor.
     * @param pMetadataKey - Metadata key.
     */
    getMetadata(pMetadataKey) {
        return this.mCustomMetadata.get(pMetadataKey) ?? null;
    }
    /**
     * Set metadata of constructor.
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     */
    setMetadata(pMetadataKey, pMetadataValue) {
        this.mCustomMetadata.set(pMetadataKey, pMetadataValue);
    }
}
exports.PropertyMetadata = PropertyMetadata;
//# sourceMappingURL=property-metadata.js.map