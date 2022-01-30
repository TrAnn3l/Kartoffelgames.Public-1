"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMode = void 0;
var UpdateMode;
(function (UpdateMode) {
    /**
     * Update on every change inside app.
     */
    UpdateMode[UpdateMode["Global"] = 1] = "Global";
    /**
     * Update on every changes inside component.
     * Better performance but not every change is covered.
     */
    UpdateMode[UpdateMode["Capsuled"] = 2] = "Capsuled";
    /**
     * Only update manually.
     */
    UpdateMode[UpdateMode["Manual"] = 3] = "Manual";
})(UpdateMode = exports.UpdateMode || (exports.UpdateMode = {}));
//# sourceMappingURL=update-mode.js.map