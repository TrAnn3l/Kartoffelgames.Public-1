"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHandler = void 0;
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
const update_scope_1 = require("../../enum/update-scope");
class UpdateHandler {
    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    constructor(pUpdateScope) {
        this.mUpdateScope = pUpdateScope;
        // Create new change detection if component is not inside change detection or mode is capsuled.
        if (!web_change_detection_1.ChangeDetection.current || this.mUpdateScope === update_scope_1.UpdateScope.Capsuled) {
            this.mChangeDetection = new web_change_detection_1.ChangeDetection('DefaultComponentZone');
        }
        else if (this.mUpdateScope === update_scope_1.UpdateScope.Manual) {
            this.mChangeDetection = new web_change_detection_1.ChangeDetection('Manual Zone', null, true);
        }
        else {
            this.mChangeDetection = web_change_detection_1.ChangeDetection.currentNoneSilent;
        }
    }
    /**
     * Execute function inside update detection scope.
     * @param pFunction - Function.
     */
    execute(pFunction) {
        // Execute outside scope if set to manual.
        if (this.mUpdateScope === update_scope_1.UpdateScope.Manual) {
            pFunction();
        }
        else {
            this.mChangeDetection.execute(pFunction);
        }
    }
}
exports.UpdateHandler = UpdateHandler;
//# sourceMappingURL=update-handler.js.map