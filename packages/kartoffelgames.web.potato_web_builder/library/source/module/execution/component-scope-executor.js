"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentScopeExecutor = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
/**
 * Executes string in set component values scope.
 */
class ComponentScopeExecutor {
    /**
     * Execute string in userclass context.
     * @param pExpression - Expression to execute.
     * @param pValues - Current component values.
     * @param pExtenedData - Extended data that are only exist for this execution.
     */
    static execute(pExpression, pValues, pExtenedData) {
        const lReferencedValues = ComponentScopeExecutor.extractReferences(pExpression);
        const lExtendedData = pExtenedData ?? new core_data_1.Dictionary();
        const lContext = pValues.componentManager.userObjectHandler.userObject;
        const lEvaluatedFunction = ComponentScopeExecutor.createEvaluationFunktion(pExpression, lReferencedValues, pValues, lExtendedData);
        return lEvaluatedFunction.call(lContext);
    }
    /**
     * Execute string in userclass context.
     * Does not trigger change events.
     * @param pExpression - Expression to execute.
     * @param pValues - Current component values.
     * @param pExtenedData - Extended data that are only exist for this execution.
     */
    static executeSilent(pExpression, pValues, pExtenedData) {
        const lCurrentChangeDetection = web_change_detection_1.ChangeDetection.currentNoneSilent ?? web_change_detection_1.ChangeDetection.current;
        return lCurrentChangeDetection.silentExecution(() => {
            return ComponentScopeExecutor.execute(pExpression, pValues, pExtenedData);
        });
    }
    /**
     * Creates a function that returns the expression result value.
     * @param _pExpression - Expression to execute.
     * @param _pReferenceNameList - Names of variables that are not properties from user class object.
     * @param _pReferencedValues - Current component values.
     * @param _pExtenedValue - Extended data that are only exist for this execution.
     * @returns
     */
    static createEvaluationFunktion(_pExpression, _pReferenceNameList, _pReferencedValues, _pExtenedValue) {
        let lString;
        // Starting function
        lString = '(function() {return function () {';
        // Add all enviroment variables.
        for (const lReferenceName of _pReferenceNameList) {
            // Check if reference is a extended data value.
            if (_pExtenedValue.has(lReferenceName)) {
                lString += `const ${lReferenceName} = _pExtenedValue.get('${lReferenceName}');`;
            }
            else {
                lString += `const ${lReferenceName} = _pReferencedValues.getTemporaryValue('${lReferenceName}');`;
            }
        }
        // Add result from path.
        lString += `return ${_pExpression};`;
        // Ending function
        lString += '}})();';
        // Return evaluated function.
        return eval(lString);
    }
    /**
     * Extract all variable names that are not window or this.
     * @param pExpression - Expression.
     */
    static extractReferences(pExpression) {
        const lSystemNames = new Array();
        lSystemNames.push('do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else', 'enum', 'eval', 'false', 'null', 'this', 'true', 'void', 'with', 'break', 'catch', 'class', 'const', 'super', 'throw', 'while', 'yield', 'delete', 'export', 'import', 'public', 'return', 'static', 'switch', 'typeof', 'default', 'extends', 'finally', 'package', 'private', 'continue', 'debugger', 'function', 'arguments', 'interface', 'protected', 'implements', 'instanceof', 'self', 'window');
        const lFindingRegex = /"[^"]*?"|'[^']*?'|`[^`]*?`|\.[a-zA-Z0-9_$#]*|[a-zA-Z0-9_$#]+/g;
        let lFoundOccurrence;
        const lResult = new core_data_1.List();
        // Find all Occurences of the search string.
        while ((lFoundOccurrence = lFindingRegex.exec(pExpression))) {
            const lVariableName = lFoundOccurrence[0];
            // Ignore names in strings, numbers and properties.
            if (!lVariableName.startsWith('"') && !lVariableName.startsWith(`'`) && !lVariableName.startsWith('`') && !/^[0-9]/.test(lVariableName) && !lVariableName.startsWith('.')) {
                // Ignore this and window context.
                if (!lSystemNames.includes(lVariableName)) {
                    lResult.push(lVariableName);
                }
            }
        }
        return lResult.distinct();
    }
}
exports.ComponentScopeExecutor = ComponentScopeExecutor;
//# sourceMappingURL=component-scope-executor.js.map