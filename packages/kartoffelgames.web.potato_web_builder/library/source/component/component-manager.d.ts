import { UserClass } from '../interface/user-class';
import { LayerValues } from './values/layer-values';
import { UpdateScope } from '../enum/update-scope';
import { UpdateHandler } from './handler/update-handler';
import { UserObjectHandler } from './handler/user-object-handler';
import { ElementHandler } from './handler/element-handler';
import { UserEventHandler } from './handler/user-event-handler';
import { PwbExpressionModuleConstructor } from '../interface/module/expression-module';
/**
 * Base component handler. Handles initialisation and update of components.
 */
export declare class ComponentManager {
    private static readonly mComponentCache;
    private static readonly mXmlParser;
    private readonly mElementHandler;
    private mFirstAttachment;
    private readonly mRootBuilder;
    private readonly mUpdateHandler;
    private readonly mUserEventHandler;
    private readonly mUserObjectHandler;
    /**
     * Get element handler.
     */
    get elementHandler(): ElementHandler;
    /**
     * Get user event handler.
     */
    get userEventHandler(): UserEventHandler;
    /**
     * Get user class object.
     */
    get userObjectHandler(): UserObjectHandler;
    /**
     * Get component values of the root builder.
     */
    get rootValues(): LayerValues;
    /**
     * Update handler.
     */
    get updateHandler(): UpdateHandler;
    /**
     * Constructor.
     * Initialized build parameter.
     * @param pUserClassObject - User class object.
     * @param pTemplate - Template content of component.
     * @param pAttributeModules - Attribute modules of component.
     */
    constructor(pUserClass: UserClass, pTemplate: string, pExpressionModule: PwbExpressionModuleConstructor, pHtmlComponent: HTMLElement, pUpdateScope: UpdateScope);
    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    addStyle(pStyle: string): void;
    /**
     * Called when component get attached to DOM.
     */
    connected(): void;
    /**
     * Deconstruct element.
     */
    deconstruct(): void;
    /**
     * Called when component gets detached from DOM.
     */
    disconnected(): void;
}
//# sourceMappingURL=component-manager.d.ts.map