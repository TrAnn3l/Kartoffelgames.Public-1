import { Dictionary } from '@kartoffelgames/core.data';
import { UserClass } from '../interface/user-class';
import { StaticBuilder } from './builder/static-builder';
import { ComponentModules } from '../module/component-modules';
import { LayerValues } from './values/layer-values';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { XmlDocument } from '@kartoffelgames/core.xml';
import { PwbApp } from '../pwb-app';
import { ElementCreator } from './content/element-creator';
import { PwbElementReference } from './user_reference/pwb-element-reference';
import { UpdateScope } from '../enum/update-scope';
import { TemplateParser } from '../parser/template-parser';
import { UpdateHandler } from './handler/update-handler';
import { UserObjectHandler } from './handler/user-object-handler';
import { ElementHandler } from './handler/element-handler';
import { ComponentConnection } from './component-connection';
import { UserEventHandler } from './handler/user-event-handler';
import { PwbExpressionModuleConstructor } from '../interface/module/expression-module';
import { PwbUpdateReference } from './user_reference/pwb-update-reference';

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class ComponentManager {
    private static readonly mComponentCache: Dictionary<UserClass, [ComponentModules, XmlDocument]> = new Dictionary<UserClass, [ComponentModules, XmlDocument]>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();

    private readonly mElementHandler: ElementHandler;
    private readonly mRootBuilder: StaticBuilder;
    private readonly mUpdateHandler: UpdateHandler;
    private readonly mUserEventHandler: UserEventHandler;
    private readonly mUserObjectHandler: UserObjectHandler;

    /**
     * Get element handler.
     */
    public get elementHandler(): ElementHandler {
        return this.mElementHandler;
    }

    /**
     * Get user event handler.
     */
    public get userEventHandler(): UserEventHandler {
        return this.mUserEventHandler;
    }

    /**
     * Get user class object.
     */
    public get userObjectHandler(): UserObjectHandler {
        return this.mUserObjectHandler;
    }

    /**
     * Get component values of the root builder. 
     */
    public get rootValues(): LayerValues {
        return this.mRootBuilder.values.rootValue;
    }

    /**
     * Update handler.
     */
    public get updateHandler(): UpdateHandler {
        return this.mUpdateHandler;
    }

    /**
     * 
     * @param pUserClass - User class constructor.
     * @param pTemplate - Template as xml string.
     * @param pExpressionModule - Expression module constructor.
     * @param pHtmlComponent - HTMLElement of component.
     * @param pUpdateScope - Update scope of component.
     */
    public constructor(pUserClass: UserClass, pTemplate: string, pExpressionModule: PwbExpressionModuleConstructor, pHtmlComponent: HTMLElement, pUpdateScope: UpdateScope) {
        // Load cached or create new module handler and template.
        const lCache: [ComponentModules, XmlDocument] = ComponentManager.mComponentCache.get(pUserClass);
        let lModules: ComponentModules;
        let lTemplate: XmlDocument;
        if (!lCache) {
            lTemplate = ComponentManager.mXmlParser.parse(pTemplate);
            lModules = new ComponentModules(pExpressionModule);
            ComponentManager.mComponentCache.set(pUserClass, [lModules, lTemplate]);
        } else {
            [lModules, lTemplate] = lCache;
        }

        // Create update handler.
        const lUpdateScope: UpdateScope = pUpdateScope ?? UpdateScope.Global;
        this.mUpdateHandler = new UpdateHandler(lUpdateScope);
        this.mUpdateHandler.addUpdateListener(() => {
            // Call user class on update function.
            this.mUserObjectHandler.callOnPwbUpdate();

            // Update and callback after update.
            if (this.mRootBuilder.update()) {
                this.mUserObjectHandler.callAfterPwbUpdate();
            }
        });

        // Create user object handler.
        const lLocalInjections: Array<object> = new Array<object>();
        lLocalInjections.push(new PwbElementReference(this));
        lLocalInjections.push(new PwbUpdateReference(this));
        lLocalInjections.push(ChangeDetection.current?.getZoneData(PwbApp.PUBLIC_APP_KEY));
        this.mUserObjectHandler = new UserObjectHandler(pUserClass, this.updateHandler, lLocalInjections);

        // After build, before initialization.
        this.mUserObjectHandler.callOnPwbInitialize();

        // Create element handler and export properties.
        this.mElementHandler = new ElementHandler(pHtmlComponent, this.mUserObjectHandler);

        // Connect with this component manager.
        ComponentConnection.connectComponentManagerWith(this.elementHandler.htmlElement, this);
        ComponentConnection.connectComponentManagerWith(this.userObjectHandler.userObject, this);
        ComponentConnection.connectComponentManagerWith(this.userObjectHandler.untrackedUserObject, this);

        // Create user event handler.
        this.mUserEventHandler = new UserEventHandler(this.userObjectHandler);

        // Create component builder.
        this.mRootBuilder = new StaticBuilder(lTemplate, lTemplate, lModules, new LayerValues(this), null);
        this.elementHandler.shadowRoot.appendChild(this.mRootBuilder.anchor);

        this.mUserObjectHandler.callAfterPwbInitialize();
    }

    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        const lStyleElement: Element = ElementCreator.createElement('style');
        lStyleElement.innerHTML = pStyle;
        this.elementHandler.shadowRoot.prepend(lStyleElement);
    }

    /**
     * Called when component get attached to DOM.
     */
    public connected(): void {
        this.updateHandler.enabled = true;

        // Trigger light update.
        this.updateHandler.requestUpdate({
            source: this.userObjectHandler.userObject,
            property: Symbol('any'),
            stacktrace: Error().stack
        });
    }

    /**
     * Deconstruct element.
     */
    public deconstruct(): void {
        // Disable updates.
        this.updateHandler.enabled = false;

        // User callback.
        this.userObjectHandler.callOnPwbDeconstruct();

        // Remove change listener from app.
        this.updateHandler.deconstruct();

        // Deconstruct all child element.
        this.mRootBuilder.deconstruct();
    }

    /**
     * Called when component gets detached from DOM.
     */
    public disconnected(): void {
        this.updateHandler.enabled = false;
    }
}