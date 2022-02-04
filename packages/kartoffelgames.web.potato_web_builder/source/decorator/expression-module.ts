import { Injector } from '@kartoffelgames/core.dependency-injection';
import { ModuleType } from '../enum/module-type';
import { ExpressionModuleSetting, IPwbExpressionModule, PwbExpressionModuleConstructor } from '../interface/module/expression-module';
import { ModuleStorage } from '../module/module-storage';
import { HtmlContent } from '../types';

/**
 * AtScript. PWB Expression module.
 * @param pSettings - Module settings.
 */
export function ExpressionModule(pSettings: ExpressionModuleSetting): any {
    return (pExpressionModuleConstructor: PwbExpressionModuleConstructor) => {

        // Set user class to be injectable
        Injector.Injectable(pExpressionModuleConstructor);

        /**
         * Inherit base constructor and extend by access modifier.
         */
        const lExpressionModule: PwbExpressionModuleConstructor = class implements IPwbExpressionModule {
            /**
             * This module type.
             */
            static readonly moduleType: ModuleType.Expression = ModuleType.Expression;

            private mKey: string;
            private mLastResult: string;
            private readonly mModuleObject: IPwbExpressionModule;
            private mTargetNode: HtmlContent | Text;
            private mValue: string;

            /**
             * Null on text element or attribute name on attribute.
             */
            public get key(): string {
                return this.mKey;
            }

            /**
             * Null on text element or attribute name on attribute.
             */
            public set key(pValue: string) {
                this.mKey = pValue;
            }

            /**
             * Targte node of expression module.
             */
            public get targetNode(): HtmlContent | Text {
                return this.mTargetNode;
            }

            /**
             * Targte node of expression module.
             */
            public set targetNode(pValue: HtmlContent | Text) {
                this.mTargetNode = pValue;
            }

            /**
             * Value of attribute or text element.
             */
            public get value(): string {
                return this.mValue;
            }

            /**
             * Value of attribute or text element.
             */
            public set value(pValue: string) {
                this.mValue = pValue;
            }

            /**
             * Constructor.
             * @param pArgs - Arguments for inner module object.
             */
            public constructor(...pArgs: Array<any>) {
                this.mModuleObject = new (<any>pExpressionModuleConstructor)(...pArgs);
            }

            /**
             * Process all expressions inside value.
             */
            public process(): boolean {
                const lResultText: string = this.getResult();

                // Add resul text to attribute or text node.
                this.updateValue(lResultText);

                // Check if any expression was executed. If not do nothing and return negative result.
                return lResultText !== this.mValue;
            }

            /**
             * Get value of expression.
             * @param pExpression - Expression.
             */
            public processExpression(pExpression: string): string {
                return this.mModuleObject.processExpression(pExpression);
            }

            /**
             * Update components text value.
             * @returns false. Do never recreate element.
             */
            public update(): boolean {
                const lCurrentResult: string = this.getResult();

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
            private getResult(): string {
                // Search for expressions and replace it with execution result.
                const lResultText: string = this.mValue.replace(new RegExp(pSettings.expressionSelector, 'g'), (pFoundExpression: string): string => {
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
            private updateValue(pValue: string): void {
                // Add result text to TextNode or as attribute.
                if (this.mTargetNode instanceof Element) {
                    this.mTargetNode.setAttribute(this.mKey, pValue);
                } else { // Text
                    this.mTargetNode.nodeValue = pValue;
                }
            }
        };

        // Add module to storage.
        ModuleStorage.addModule(lExpressionModule);

        return lExpressionModule;
    };
}