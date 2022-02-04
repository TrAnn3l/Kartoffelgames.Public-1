"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustacheExpressionModule = void 0;
const component_scope_executor_1 = require("../execution/component-scope-executor");
const layer_values_1 = require("../../component/values/layer-values");
const expression_module_1 = require("../../decorator/expression-module");
/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
let MustacheExpressionModule = class MustacheExpressionModule {
    /**
     * Constructor.
     * @param pValueHandler - Values of component.
     */
    constructor(pValueHandler) {
        this.mValueHandler = pValueHandler;
    }
    /**
     * Execute expression with ComponentScopeExecutor.
     * @param pExpression - Expression.
     * @param pValues - Component values.
     * @returns expression result.
     */
    processExpression(pExpression) {
        // Cut out mustache.
        const lExpressionText = pExpression.substr(2, pExpression.length - 4);
        // Execute string
        const lExecutionResult = component_scope_executor_1.ComponentScopeExecutor.executeSilent(lExpressionText, this.mValueHandler);
        return lExecutionResult?.toString();
    }
};
MustacheExpressionModule = __decorate([
    (0, expression_module_1.ExpressionModule)({
        expressionSelector: /{{.*?}}/
    }),
    __metadata("design:paramtypes", [layer_values_1.LayerValues])
], MustacheExpressionModule);
exports.MustacheExpressionModule = MustacheExpressionModule;
//# sourceMappingURL=mustache-expression-module.js.map