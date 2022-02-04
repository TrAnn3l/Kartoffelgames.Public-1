"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionModule = void 0;
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const module_type_1 = require("../enum/module-type");
const module_storage_1 = require("../module/module-storage");
/**
 * AtScript. PWB Expression module.
 * @param pSettings - Module settings.
 */
function ExpressionModule(pSettings) {
    return (pExpressionModuleConstructor) => {
        var _a;
        // Set user class to be injectable
        core_dependency_injection_1.Injector.Injectable(pExpressionModuleConstructor);
        /**
         * Inherit base constructor and extend by access modifier.
         */
        const lExpressionModule = (_a = class {
                /**
                 * Constructor.
                 * @param pArgs - Arguments for inner module object.
                 */
                constructor(...pArgs) {
                    this.mModuleObject = new pExpressionModuleConstructor(...pArgs);
                }
                /**
                 * Null on text element or attribute name on attribute.
                 */
                get key() {
                    return this.mKey;
                }
                /**
                 * Null on text element or attribute name on attribute.
                 */
                set key(pValue) {
                    this.mKey = pValue;
                }
                /**
                 * Targte node of expression module.
                 */
                get targetNode() {
                    return this.mTargetNode;
                }
                /**
                 * Targte node of expression module.
                 */
                set targetNode(pValue) {
                    this.mTargetNode = pValue;
                }
                /**
                 * Value of attribute or text element.
                 */
                get value() {
                    return this.mValue;
                }
                /**
                 * Value of attribute or text element.
                 */
                set value(pValue) {
                    this.mValue = pValue;
                }
                /**
                 * Process all expressions inside value.
                 */
                process() {
                    const lResultText = this.getResult();
                    // Add resul text to attribute or text node.
                    this.updateValue(lResultText);
                    // Check if any expression was executed. If not do nothing and return negative result.
                    return lResultText !== this.mValue;
                }
                /**
                 * Get value of expression.
                 * @param pExpression - Expression.
                 */
                processExpression(pExpression) {
                    return this.mModuleObject.processExpression(pExpression);
                }
                /**
                 * Update components text value.
                 * @returns false. Do never recreate element.
                 */
                update() {
                    const lCurrentResult = this.getResult();
                    // Update value if results have changed.
                    if (this.mLastResult !== lCurrentResult) {
                        this.updateValue(lCurrentResult);
                        this.mLastResult = lCurrentResult;
                        return true;
                    }
                    return false;
                }
                /**
                 * Execute all expressions and replace the result in text.
                 * @returns text with all expressions executed.
                 */
                getResult() {
                    // Search for expressions and replace it with execution result.
                    const lResultText = this.mValue.replace(new RegExp(pSettings.expressionSelector, 'g'), (pFoundExpression) => {
                        return this.processExpression(pFoundExpression);
                    });
                    // Decode html encoded text.
                    return lResultText.replace(/&#(\d+);/g, (_pFullMatch, pCharAsDecimal) => {
                        return String.fromCharCode(pCharAsDecimal);
                    });
                }
                /**
                 * Update value of target text or attribute.
                 * @param pValue - Result value of expression text.
                 */
                updateValue(pValue) {
                    // Add result text to TextNode or as attribute.
                    if (this.mTargetNode instanceof Element) {
                        this.mTargetNode.setAttribute(this.mKey, pValue);
                    }
                    else { // Text
                        this.mTargetNode.nodeValue = pValue;
                    }
                }
            },
            /**
             * This module type.
             */
            _a.moduleType = module_type_1.ModuleType.Expression,
            _a);
        // Add module to storage.
        module_storage_1.ModuleStorage.addModule(lExpressionModule);
        return lExpressionModule;
    };
}
exports.ExpressionModule = ExpressionModule;
//# sourceMappingURL=expression-module.js.map