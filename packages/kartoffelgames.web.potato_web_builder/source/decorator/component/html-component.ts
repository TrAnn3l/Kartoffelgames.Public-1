import { ComponentManager } from '../../component/component-manager';
import { InjectionConstructor, Injector, Metadata } from '@kartoffelgames/core.dependency-injection';
import { UserClass } from '../../interface/user-class';
import { PwbExpressionModuleConstructor } from '../../interface/module/expression-module';
import { PwbManipulatorAttributeModuleConstructor } from '../../interface/module/manipulator-attribute-module';
import { PwbStaticAttributeModuleConstructor } from '../../interface/module';
import { UpdateScope } from '../../enum/update-scope';
import { MetadataKey } from '../../global-key';

/**
 * AtScript. PWB Component.
 * @param pParameter - Parameter defaults on creation.
 */
export function HtmlComponent(pParameter: HtmlComponentParameter): any {
    // Needs constructor without argument.
    return (pUserClassConstructor: UserClass) => {
        // Set user class to be injectable.
        Injector.Injectable(pUserClassConstructor);

        // Set element metadata.
        Metadata.get(pUserClassConstructor).setMetadata(MetadataKey.METADATA_SELECTOR, pParameter.selector);

        // Create custom html element of parent type.
        const lPwbComponentConstructor = class extends HTMLElement {
            private readonly mComponentManager: ComponentManager;

            /**
             * Constructor.
             * Build custom html element thats build itself.
             */
            public constructor() {
                super();

                // Create component handler.
                this.mComponentManager = new ComponentManager(
                    pUserClassConstructor,
                    pParameter.template,
                    pParameter.expressionmodule,
                    this,
                    pParameter.updateScope
                );

                // Append style if specified. Styles are scoped on components shadow root.
                if (pParameter.style) {
                    this.mComponentManager.addStyle(pParameter.style);
                }
            }

            /**
             * Lifecycle callback.
             * Callback when element get attached to dom.
             */
            public connectedCallback(): void {
                this.mComponentManager.connected();
            }

            /**
             * Lifecycle callback.
             * Callback when element get detached from dom.
             */
            public disconnectedCallback(): void {
                this.mComponentManager.disconnected();
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
    components?: Array<InjectionConstructor>;
    updateScope?: UpdateScope;
};
