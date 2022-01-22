"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
/**
 * Basic exception.
 */
class Exception extends Error {
    /**
     * Constructor. Create exception.
     * @param pMessage - Messsage of exception.
     * @param pTarget - Target exception throws.
     */
    constructor(pMessage, pTarget) {
        super(pMessage);
        this.mTarget = pTarget;
    }
    /**
     * Target exception throws.
     */
    get target() {
        return this.mTarget;
    }
}
exports.Exception = Exception;
//# sourceMappingURL=exception.js.map