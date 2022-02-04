"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateScope = void 0;
var UpdateScope;
(function (UpdateScope) {
    /**
     * Update on every change inside app.
     */
    UpdateScope[UpdateScope["Global"] = 1] = "Global";
    /**
     * Update on every changes inside component.
     * Better performance but not every change is covered.
     */
    UpdateScope[UpdateScope["Capsuled"] = 2] = "Capsuled";
    /**
     * Only update manually.
     */
    UpdateScope[UpdateScope["Manual"] = 3] = "Manual";
})(UpdateScope = exports.UpdateScope || (exports.UpdateScope = {}));
//# sourceMappingURL=update-scope.js.map