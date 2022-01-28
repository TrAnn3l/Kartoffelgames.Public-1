"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const decoration_history_1 = require("../reflect/decoration-history");
const constructor_metadata_1 = require("./constructor-metadata");
/**
 * Static.
 * Metadata storage.
 */
class Metadata {
    /**
     * Get metadata of constructor.
     */
    static get(pConstructor) {
        // Find registered constructor that has the metadata information.
        const lHistory = decoration_history_1.DecorationHistory.getBackwardHistoryOf(pConstructor);
        const lRegisteredConstructor = lHistory.find((pConstructorHistory) => {
            return Metadata.mConstructorMetadata.has(pConstructorHistory);
        });
        // Create new or get metadata.
        let lMetadata;
        if (!lRegisteredConstructor) {
            lMetadata = new constructor_metadata_1.ConstructorMetadata();
            Metadata.mConstructorMetadata.add(pConstructor, lMetadata);
        }
        else {
            lMetadata = Metadata.mConstructorMetadata.get(lRegisteredConstructor);
        }
        return lMetadata;
    }
}
exports.Metadata = Metadata;
Metadata.mConstructorMetadata = new core_data_1.Dictionary();
//# sourceMappingURL=metadata.js.map