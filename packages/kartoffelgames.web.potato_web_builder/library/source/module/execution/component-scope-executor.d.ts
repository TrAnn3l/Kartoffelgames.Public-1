import { Dictionary } from '@kartoffelgames/core.data';
import { ComponentValues } from '../../component/component-values';
/**
 * Executes string in set component values scope.
 */
export declare class ComponentScopeExecutor {
    /**
     * Execute string in userclass context.
     * @param pExpression - Expression to execute.
     * @param pValues - Current component values.
     * @param pExtenedData - Extended data that are only exist for this execution.
     */
    static execute(pExpression: string, pValues: ComponentValues, pExtenedData?: Dictionary<string, any>): any;
    /**
     * Execute string in userclass context.
     * Does not trigger change events.
     * @param pExpression - Expression to execute.
     * @param pValues - Current component values.
     * @param pExtenedData - Extended data that are only exist for this execution.
     */
    static executeSilent(pExpression: string, pValues: ComponentValues, pExtenedData?: Dictionary<string, any>): any;
    /**
     * Creates a function that returns the expression result value.
     * @param _pExpression - Expression to execute.
     * @param _pReferenceNameList - Names of variables that are not properties from user class object.
     * @param _pReferencedValues - Current component values.
     * @param _pExtenedValue - Extended data that are only exist for this execution.
     * @returns
     */
    private static createEvaluationFunktion;
    /**
     * Extract all variable names that are not window or this.
     * @param pExpression - Expression.
     */
    private static extractReferences;
}
//# sourceMappingURL=component-scope-executor.d.ts.map