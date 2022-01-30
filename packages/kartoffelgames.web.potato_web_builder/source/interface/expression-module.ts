import { ModuleType } from '../enum/module-type';
import { HtmlContent } from '../types';

export interface IPwbExpressionModule extends IPwbExpressionOnProcess {
    /**
     * Null on text element or attribute name on attribute.
     */
    key: string;

    /**
     * Targte node of expression module.
     */
    targetNode: HtmlContent | Text;

    /**
     * Value of attribute or text element.
     */
    value: string;

    /**
    * Processes the module.
    */
    process(): boolean;

    /**
     * Update data related to this  module.
     * @returns if any update was made.
     */
    update(): boolean;
}

export type PwbExpressionModuleConstructor = {
    /**
     * Loced module type to Expression.
     */
    readonly moduleType: ModuleType.Expression;

    /**
     * Constructor
     */
    new(): IPwbExpressionModule;
};

export interface IPwbExpressionOnProcess {
    /**
     * Get value of expression.
     * @param pExpression - Expression.
     */
    processExpression(pExpression: string): string;
}

export type ExpressionModuleSetting = {
    /**
     * Selector of attributes the modules gets applied.
     */
    readonly expressionSelector: RegExp;
}



