"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructorMetadata = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const property_metadata_1 = require("./property-metadata");
/**
 * Constructor metadata.
 */
class ConstructorMetadata {
    /**
     * Constructor.
     * Initialize lists.
     */
    constructor() {
        this.mCustomMetadata = new core_data_1.Dictionary();
        this.mPropertyMetadata = new core_data_1.Dictionary();
    }
    /**
     * Get parameter type information.
     */
    get parameterTypes() {
        return this.mParameterTypes ?? null;
    }
    /**
     * Set parameter type information.
     */
    set parameterTypes(pParameterTypes) {
        // Copy array.
        this.mParameterTypes = core_data_1.List.newListWith(...pParameterTypes);
    }
    /**
     * Get metadata of constructor.
     * @param pMetadataKey - Metadata key.
     */
    getMetadata(pMetadataKey) {
        return this.mCustomMetadata.get(pMetadataKey);
    }
    /**
     * Get property by key.
     * Creates new property metadata if it not already exists.
     * @param pPropertyKey - Key of property.
     */
    getProperty(pPropertyKey) {
        // Create if missing.
        if (!this.mPropertyMetadata.has(pPropertyKey)) {
            this.mPropertyMetadata.add(pPropertyKey, new property_metadata_1.PropertyMetadata());
        }
        return this.mPropertyMetadata.get(pPropertyKey);
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
exports.ConstructorMetadata = ConstructorMetadata;
//# sourceMappingURL=constructor-metadata.js.map