import { Dictionary } from '@kartoffelgames/core.data';
import { XmlDocument, XmlElement } from '@kartoffelgames/core.xml';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { ComponentElementReference } from '../injection_reference/component-element-reference';
import { ComponentUpdateReference } from '../injection_reference/component-update-reference';
import { IPwbExpressionModuleClass } from '../module/interface/module';
import { PwbApp } from '../pwb-app';
import { StaticBuilder } from './builder/static-builder';
import { ComponentConnection } from './component-connection';
import { ComponentExtensions } from './component-extensions';
import { ComponentModules } from './component-modules';
import { ElementCreator } from './content/element-creator';
import { UpdateScope } from './enum/update-scope';
import { ElementHandler } from './handler/element-handler';
import { UpdateHandler } from './handler/update-handler';
import { UserObjectHandler } from './handler/user-object-handler';
import { UserClass } from './interface/user-class';
import { TemplateParser } from './parser/template-parser';
import { LayerValues } from './values/layer-values';

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class ComponentManager {
    public static readonly METADATA_SELECTOR: string = 'pwb:selector';

    private static readonly mComponentCache: Dictionary<UserClass, [ComponentModules, XmlDocument]> = new Dictionary<UserClass, [ComponentModules, XmlDocument]>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();

    private readonly mElementHandler: ElementHandler;
    private readonly mExtensions: ComponentExtensions;
    private readonly mRootBuilder: StaticBuilder;
    private readonly mUpdateHandler: UpdateHandler;
    private readonly mUserObjectHandler: UserObjectHandler;

    /**
     * Get element handler.
     */
    public get elementHandler(): ElementHandler {
        return this.mElementHandler;
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
     * Constructor.
     * @param pUserClass - User class constructor.
     * @param pTemplateString - Template as xml string.
     * @param pExpressionModule - Expression module constructor.
     * @param pHtmlComponent - HTMLElement of component.
     * @param pUpdateScope - Update scope of component.
     */
    public constructor(pUserClass: UserClass, pTemplateString: string, pExpressionModule: IPwbExpressionModuleClass, pHtmlComponent: HTMLElement, pUpdateScope: UpdateScope) {
        // Load cached or create new module handler and template.
        const lCache: [ComponentModules, XmlDocument] = ComponentManager.mComponentCache.get(pUserClass);
        let lModules: ComponentModules;
        let lTemplate: XmlDocument;
        if (!lCache) {
            const lTemplateString = pTemplateString ?? '';
            lTemplate = ComponentManager.mXmlParser.parse(lTemplateString);
            lModules = new ComponentModules(this, pExpressionModule);
            ComponentManager.mComponentCache.set(pUserClass, [lModules, lTemplate]);
        } else {
            [lModules, lTemplate] = lCache;
        }

        // Create update handler.
        const lUpdateScope: UpdateScope = pUpdateScope ?? UpdateScope.Global;
        this.mUpdateHandler = new UpdateHandler(lUpdateScope);
        this.mUpdateHandler.addUpdateListener(() => {
            // Call user class on update function.
            this.mUpdateHandler.executeOutZone(() => {
                this.mUserObjectHandler.callOnPwbUpdate();
            });

            // Update and callback after update.
            if (this.mRootBuilder.update()) {
                this.mUserObjectHandler.callAfterPwbUpdate();
            }
        });

        // Create user object handler.
        const lLocalInjections: Array<object> = new Array<object>();
        lLocalInjections.push(new ComponentElementReference(pHtmlComponent));
        lLocalInjections.push(new ComponentUpdateReference(this.mUpdateHandler));
        //lLocalInjections.push(ChangeDetection.current?.getZoneData(PwbApp.PUBLIC_APP_KEY)); TODO: How?
        this.mUserObjectHandler = new UserObjectHandler(pUserClass, this.updateHandler, lLocalInjections);

        // After build, before initialization.
        this.mUserObjectHandler.callOnPwbInitialize();

        // Create element handler and export properties.
        this.mElementHandler = new ElementHandler(pHtmlComponent);

        // Connect with this component manager.
        ComponentConnection.connectComponentManagerWith(this.elementHandler.htmlElement, this);
        ComponentConnection.connectComponentManagerWith(this.userObjectHandler.userObject, this);
        ComponentConnection.connectComponentManagerWith(this.userObjectHandler.untrackedUserObject, this);

        // Create extensions.
        this.mExtensions = new ComponentExtensions({
            componentManager: this,
            componentElement: pHtmlComponent,
            targetClass: this.mUserObjectHandler.userClass,
            targetObject: this.mUserObjectHandler.userObject
        });

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
        const lStyleTemplate: XmlElement = new XmlElement();
        lStyleTemplate.tagName = 'style';
        lStyleTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

        const lStyleElement: Element = ElementCreator.createElement(lStyleTemplate);
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

        // Deconstruct all extensions.
        this.mExtensions.deconstruct();

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