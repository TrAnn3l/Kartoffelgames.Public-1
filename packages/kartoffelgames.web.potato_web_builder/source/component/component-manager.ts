import { Dictionary } from '@kartoffelgames/core.data';
import { UserClass } from '../interface/user-class';
import { StaticBuilder } from './builder/static-builder';
import { ComponentModules } from './component-modules';
import { LayerValues } from './values/layer-values';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { XmlDocument } from '@kartoffelgames/core.xml';
import { PwbApp } from '../pwb-app';
import { ElementCreator } from './content/element-creator';
import { PwbComponent } from '../handler/pwb-component';
import { UpdateScope } from '../enum/update-scope';
import { TemplateParser } from '../parser/template-parser';
import { UpdateHandler } from './handler/update-handler';
import { UserObjectHandler } from './handler/user-object-handler';
import { ElementHandler } from './handler/element-handler';
import { ComponentConnection } from './component-connection';
import { UserEventHandler } from './handler/user-event-handler';
import { PwbExpressionModuleConstructor } from '../interface/module/expression-module';

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class ComponentManager {
    private static readonly mComponentCache: Dictionary<UserClass, [ComponentModules, XmlDocument]> = new Dictionary<UserClass, [ComponentModules, XmlDocument]>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();

    private readonly mElementHandler: ElementHandler;
    private mFirstAttachment: boolean;
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
        return this.mRootBuilder.values;
    }

    /**
     * Update handler.
     */
    public get updateHandler(): UpdateHandler {
        return this.mUpdateHandler;
    }

    /**
     * Constructor.
     * Initialized build parameter.
     * @param pUserClassObject - User class object.
     * @param pTemplate - Template content of component.
     * @param pAttributeModules - Attribute modules of component.
     */
    public constructor(pUserClass: UserClass, pTemplate: string, pExpressionModule: PwbExpressionModuleConstructor, pHtmlComponent: HTMLElement, pUpdateScope: UpdateScope) {
        // Load cached or create new module handler and template.
        let [lModules, lTemplate] = ComponentManager.mComponentCache.get(pUserClass);
        if (!lModules || !lTemplate) {
            lTemplate = ComponentManager.mXmlParser.parse(pTemplate);
            lModules = new ComponentModules(pExpressionModule);
            ComponentManager.mComponentCache.set(pUserClass, [lModules, lTemplate]);
        }

        // Create update handler.
        const lUpdateScope: UpdateScope = pUpdateScope ?? UpdateScope.Global;
        this.mUpdateHandler = new UpdateHandler(this.mUserObjectHandler, lUpdateScope);
        this.mUpdateHandler.addUpdateListener(() => { return this.mRootBuilder.updateBuild(); });

        // Create user object handler.
        const lLocalInjections: Array<object> = new Array<object>();
        lLocalInjections.push(new PwbComponent(this));
        lLocalInjections.push(ChangeDetection.current?.getZoneData(PwbApp.PUBLIC_APP_KEY));
        this.mUserObjectHandler = new UserObjectHandler(pUserClass, this.updateHandler, lLocalInjections);

        // After build, before initialization.
        this.mUserObjectHandler.callOnPwbInitialize();

        // Create element handler and export properties.
        this.mElementHandler = new ElementHandler(pHtmlComponent, this.mUserObjectHandler);
        this.mElementHandler.connectExportedProperties();

        // Connect with this component manager.
        ComponentConnection.connectComponentManagerWith(this.elementHandler.htmlElement, this);
        ComponentConnection.connectComponentManagerWith(this.userObjectHandler.userObject, this);
        ComponentConnection.connectComponentManagerWith(this.userObjectHandler.untrackedUserObject, this);

        // Create user event handler.
        this.mUserEventHandler = new UserEventHandler(this.userObjectHandler);

        // Create component values handler with watched user class object.
        const lComponentValues: LayerValues = new LayerValues(this);




        // Create component builder.
        this.mRootBuilder = new StaticBuilder(lTemplate.body, lModules, lComponentValues, this, false);
        this.elementHandler.shadowRoot.appendChild(this.mRootBuilder.anchor);

        // Initialize lists and default values.
        this.mFirstAttachment = true;

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
        if (!this.mFirstAttachment) {
            this.mFirstAttachment = true;
            // Start initialize build.
            this.mRootBuilder.initializeBuild();
        }

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

        // Deconstruct all child element.s
        this.mRootBuilder.deleteBuild();
    }

    /**
     * Called when component gets detached from DOM.
     */
    public disconnected(): void {
        this.updateHandler.enabled = false;
    }
}