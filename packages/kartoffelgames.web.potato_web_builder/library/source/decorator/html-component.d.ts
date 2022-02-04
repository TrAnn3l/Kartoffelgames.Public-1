import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { PwbExpressionModuleConstructor } from '../interface/module/expression-module';
import { PwbManipulatorAttributeModuleConstructor } from '../interface/module/manipulator-attribute-module';
import { PwbStaticAttributeModuleConstructor } from '../interface/module/static-attribute-module';
import { UpdateScope } from '../enum/update-scope';
/**
 * AtScript. PWB Component.
 * @param pParameter - Parameter defaults on creation.
 */
export declare function HtmlComponent(pParameter: HtmlComponentParameter): any;
/**
 * Html component parameter.
 */
declare type HtmlComponentParameter = {
    expressionmodule?: PwbExpressionModuleConstructor | any;
    style?: string;
    selector: string;
    template?: string;
    modules?: Array<PwbManipulatorAttributeModuleConstructor | PwbStaticAttributeModuleConstructor | any>;
    components?: Array<InjectionConstructor>;
    updateScope?: UpdateScope;
};
export {};
//# sourceMappingURL=html-component.d.ts.map