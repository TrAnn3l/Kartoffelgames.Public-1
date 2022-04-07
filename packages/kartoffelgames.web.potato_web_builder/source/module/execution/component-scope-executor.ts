import { Dictionary, List } from '@kartoffelgames/core.data';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { UserObject } from '../../component/interface/user-class';
import { LayerValues } from '../../component/values/layer-values';


/**
 * Executes string in set component values scope.
 */
export class ComponentScopeExecutor {
    /**
     * Execute string in userclass context.
     * @param pExpression - Expression to execute.
     * @param pValues - Current component values.
     * @param pExtenedData - Extended data that are only exist for this execution.
     */
    public static execute(pExpression: string, pValues: LayerValues, pExtenedData?: Dictionary<string, any>): any {
        const lReferencedValues: Array<string> = ComponentScopeExecutor.extractReferences(pExpression);
        const lExtendedData: Dictionary<string, any> = pExtenedData ?? new Dictionary<string, any>();

        const lContext: UserObject = pValues.componentManager.userObjectHandler.userObject;
        const lEvaluatedFunction: () => any = ComponentScopeExecutor.createEvaluationFunktion(pExpression, lReferencedValues, pValues, lExtendedData);

        return lEvaluatedFunction.call(lContext);
    }

    /**
     * Execute string in userclass context.
     * Does not trigger change events.
     * @param pExpression - Expression to execute.
     * @param pValues - Current component values.
     * @param pExtenedData - Extended data that are only exist for this execution.
     */
    public static executeSilent(pExpression: string, pValues: LayerValues, pExtenedData?: Dictionary<string, any>): any {
        const lCurrentChangeDetection: ChangeDetection = ChangeDetection.current;

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
    private static createEvaluationFunktion(_pExpression: string, _pReferenceNameList: Array<string>, _pReferencedValues: LayerValues, _pExtenedValue: Dictionary<string, any>): () => any {
        let lString: string;

        // Starting function
        lString = '(function() {return function () {';

        // Add all enviroment variables.
        for (const lReferenceName of _pReferenceNameList) {
            // Check if reference is a extended data value.
            if (_pExtenedValue.has(lReferenceName)) {
                lString += `const ${lReferenceName} = _pExtenedValue.get('${lReferenceName}');`;
            } else {
                lString += `const ${lReferenceName} = _pReferencedValues.getValue('${lReferenceName}');`;
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
    private static extractReferences(pExpression: string): Array<string> {
        const lSystemNames: Array<string> = new Array<string>();
        lSystemNames.push('do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else', 'enum', 'eval', 'false', 'null', 'this', 'true', 'void', 'with', 'break', 'catch', 'class', 'const', 'super', 'throw', 'while', 'yield', 'delete', 'export', 'import', 'public', 'return', 'static', 'switch', 'typeof', 'default', 'extends', 'finally', 'package', 'private', 'continue', 'debugger', 'function', 'arguments', 'interface', 'protected', 'implements', 'instanceof', 'self', 'window');

        const lFindingRegex: RegExp = /"[^"]*?"|'[^']*?'|`[^`]*?`|\.[a-zA-Z0-9_$#]*|[a-zA-Z0-9_$#]+/g;
        let lFoundOccurrence: RegExpExecArray;

        const lResult: List<string> = new List<string>();

        // Find all words that can be a variable.
        while ((lFoundOccurrence = lFindingRegex.exec(pExpression))) {
            const lVariableName: string = lFoundOccurrence[0];

            // Ignore names in strings, numbers and properties.
            if (!lVariableName.startsWith('"') && !lVariableName.startsWith(`'`) && !lVariableName.startsWith('`') && !/^[0-9]/.test(lVariableName) && !lVariableName.startsWith('.')) {
                // Ignore system names.
                if (!lSystemNames.includes(lVariableName)) {
                    lResult.push(lVariableName);
                }
            }
        }

        return lResult.distinct();
    }
}
