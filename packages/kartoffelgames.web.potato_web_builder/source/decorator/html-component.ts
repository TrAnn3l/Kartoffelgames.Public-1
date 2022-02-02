import { ComponentManager } from '../component/component-manager';
import { Injector, Metadata } from '@kartoffelgames/core.dependency-injection';
import { PwbComponentConstructor, PwbComponentElement } from '../interface/html-component';
import { UserClassConstructor } from '../interface/user-class';
import { PwbExpressionModuleConstructor } from '../interface/expression-module';
import { PwbManipulatorAttributeModuleConstructor } from '../interface/manipulator-attribute-module';
import { PwbStaticAttributeModuleConstructor } from '../interface/static-attribute-module';
import { UpdateScope } from '../enum/update-scope';
import { MetadataKey } from '../global-key';

/**
 * AtScript. PWB Component.
 * @param pParameter - Parameter defaults on creation.
 */
export function HtmlComponent(pParameter: HtmlComponentParameter): any {
    // Needs constructor without argument.
    return (pUserClassConstructor: UserClassConstructor) => {
        // Set user class to be injectable.
        Injector.Injectable(pUserClassConstructor);

        // Set element metadata.
        Metadata.get(pUserClassConstructor).setMetadata(MetadataKey.METADATA_SELECTOR, pParameter.selector);

        // Create custom html element of parent type.
        const lPwbComponentConstructor: PwbComponentConstructor = class extends HTMLElement implements PwbComponentElement {
            private readonly mComponentHandler: ComponentManager;

            /**
             * Get data for accessing component handler.
             */
            public get component(): ComponentManager {
                return this.mComponentHandler;
            }

            /**
             * Constructor.
             * Build custom html element thats build itself.
             */
            public constructor() {
                super();

                // Create component handler.
                const lComponentHandler = new ComponentManager(
                    pUserClassConstructor,
                    pParameter.template,
                    pParameter.expressionmodule,
                    this,
                    pParameter.updateScope
                );

                // Append extended data to this comonent and user class object.
                this.mComponentHandler = lComponentHandler;

                // Append style if specified. Styles are scoped on components shadow root.
                if (pParameter.style) {
                    lComponentHandler.addStyle(pParameter.style);
                }

                // Initialize component handler
                lComponentHandler.initialize();
            }
        };

        // Define current element as new custom html element.
        window.customElements.define(pParameter.selector, lPwbComponentConstructor);
    };
}

/**
 * Html component parameter.
 */
type HtmlComponentParameter = {
    expressionmodule?: PwbExpressionModuleConstructor | any;
    style?: string,
    selector: string;
    template?: string;
    // Placeholder for listing modules that should be imported.
    modules?: Array<PwbManipulatorAttributeModuleConstructor | PwbStaticAttributeModuleConstructor | any>;
    // Placeholder for listing components that should be imported.
    components?: Array<PwbComponentConstructor | any>;
    updateScope?: UpdateScope;
};
