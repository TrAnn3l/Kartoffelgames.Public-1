import { ComponentModules } from '../component_manager/component-modules';
import { ComponentHandler } from '../component_manager/component-handler';
import { Injector } from '@kartoffelgames/core.dependency-injection';
import { PwbComponentConstructor, PwbComponentElement } from '../interface/html-component';
import { UserClassConstructor } from '../interface/user-class';
import { XmlDocument } from '@kartoffelgames/core.xml';
import { TemplateParser } from '../parser/template-parser';
import { PwbExpressionModuleConstructor } from '../interface/expression-module';
import { PwbManipulatorAttributeModuleConstructor } from '../interface/manipulator-attribute-module';
import { PwbStaticAttributeModuleConstructor } from '../interface/static-attribute-module';
import { UpdateMode } from '../enum/update-mode';

/**
 * AtScript. PWB Component.
 * @param pParameter - Parameter defaults on creation.
 */
export function HtmlComponent(pParameter: HtmlComponentParameter): any {
    // XMl parser with custom attribute names.
    const lParser: TemplateParser = new TemplateParser();
    const lParsedTemplate: XmlDocument = pParameter.template ? lParser.parse(pParameter.template) : new XmlDocument(''); // Ignore default-namespace.

    // Update mode
    const lUpdateMode: UpdateMode = pParameter.updateMode ?? UpdateMode.Global;

    // Needs constructor without argument.
    return (pUserClassConstructor: UserClassConstructor) => {
        // Attribute module mapping.
        const lAttributeModules: ComponentModules = new ComponentModules(pParameter.expressionmodule);

        // Extend base user class with needed component methods.
        pUserClassConstructor.createComponent = () => {
            // Create 
            return new lPwbComponentConstructor();
        };
        pUserClassConstructor.componentSelector = pParameter.selector;

        // Set user class to be injectable
        Injector.Injectable(pUserClassConstructor);

        // Create custom html element of parent type.
        const lPwbComponentConstructor: PwbComponentConstructor = class extends HTMLElement implements PwbComponentElement {
            private mComponentHandler: ComponentHandler;

            /**
             * Get data for accessing component handler.
             */
            public get componentHandler(): ComponentHandler {
                return this.mComponentHandler;
            }

            /**
             * Constructor.
             * Build custom html element thats build itself.
             */
            public constructor() {
                super();
                this.initializeComponent();
            }

            /**
             * Initialize component.
             * Add all content to component body and start automatic updates. 
             */
            private initializeComponent(): void {
                // Create component handler.
                const lComponentHandler = new ComponentHandler(pUserClassConstructor, lParsedTemplate.body, lAttributeModules, this, lUpdateMode);

                // Append extended data to this comonent and user class object.
                this.mComponentHandler = lComponentHandler;

                // Append style if specified. Styles are scoped on components shadow root.
                if (typeof pParameter.style !== 'undefined') {
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
    modules?: Array<PwbManipulatorAttributeModuleConstructor | PwbStaticAttributeModuleConstructor | any>;
    components?: Array<PwbComponentConstructor | any>;
    updateMode?: UpdateMode;
};
