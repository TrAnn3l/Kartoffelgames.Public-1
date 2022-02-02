import { Dictionary, Exception, List, Writeable } from '@kartoffelgames/core.data';
import { UserClassConstructor, UserClassObject } from '../interface/user-class';
import { StaticBuilder } from './builder/static-builder';
import { ComponentModules } from './component-modules';
import { ComponentValues } from './component-values';
import { StaticUserClassData } from '../user_class_manager/static-user-class-data';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { XmlDocument } from '@kartoffelgames/core.xml';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { PwbApp } from '../pwb-app';
import { ElementCreator } from './content/element-creator';
import { PwbComponent } from '../handler/pwb-component';
import { UpdateScope } from '../enum/update-scope';
import { TemplateParser } from '../parser/template-parser';
import { PwbExpressionModuleConstructor } from '..';
import { UpdateHandler } from './handler/update-handler';
import { UserObjectHandler } from './handler/user-object-handler';
import { ElementHandler } from './handler/element-handler';

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class ComponentManager {
    private static readonly mComponentCache: Dictionary<UserClassConstructor, [ComponentModules, XmlDocument]> = new Dictionary<UserClassConstructor, [ComponentModules, XmlDocument]>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();

    private readonly mElementHandler: ElementHandler;
    private mFirstAttachment: boolean;
    private mIsAttached: boolean;
    private mMutationObserver: MutationObserver;
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
    public get rootValues(): ComponentValues {
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
    public constructor(pUserClass: UserClassConstructor, pTemplate: string, pExpressionModule: PwbExpressionModuleConstructor, pHtmlComponent: HTMLElement, pUpdateScope: UpdateScope) {
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

        // Create component values handler with watched user class object.
        const lComponentValues: ComponentValues = new ComponentValues(lUserClassObject);

        // Create element handler and export properties.
        this.mElementHandler = new ElementHandler(pHtmlComponent, this.mUserObjectHandler);
        this.mElementHandler.connectExportedProperties();



        

        // Create component builder.
        this.mRootBuilder = new StaticBuilder(lTemplate.body, lModules, lComponentValues, this, false);
        this.elementHandler.shadowRoot.appendChild(this.mRootBuilder.anchor);

        // Initialize lists and default values.
        this.mFirstAttachment = true;
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
     * Deconstruct element.
     */
    public deconstruct(): void {
        this.userObjectHandler.callOnPwbDeconstruct();

        // Remove change listener from app.
        this.updateHandler.deconstruct();

        // Remove mutation observer.s
        this.mMutationObserver.disconnect();

        this.mRootBuilder.deleteBuild();
    }

    /**
     * Build html elements from templates and map any nessesary data.
     * Appends build element into the place that was marked by the content anchor.
     */
    public initialize(): void {
        // Create mutation observer outside zone.
        this.changeDetection.silentExecution(() => {
            // Check if element is attached to a document.
            const lElementInDocument = (pCurrentElement: Node): boolean => {
                const lRootNode: Node | ShadowRoot = pCurrentElement.getRootNode();

                if (lRootNode === document) {
                    return true;
                } else if (!lRootNode || lRootNode === pCurrentElement) {
                    return false;
                } else if (lRootNode instanceof Element) {
                    return lElementInDocument(lRootNode);
                } else if (lRootNode instanceof window.ShadowRoot) {
                    return lElementInDocument(lRootNode.host);
                }
            };

            this.mMutationObserver = new window.MutationObserver(() => {
                const lLastAttachedState: boolean = this.mIsAttached;
                this.mIsAttached = lElementInDocument(this.mComponent);

                // Call user class object after pwb initialize.
                if (this.mIsAttached || this.mFirstAttachment) {
                    this.mFirstAttachment = false;

                    // Call callback method inside none silent zone.
                    this.changeDetection.execute(() => {
                        this.mUserObjectHandler.callAfterPwbInitialize();
                    });
                }

                // Update component when element is attached to dom.
                if (!lLastAttachedState && this.mIsAttached) {
                    this.changeDetection.execute(() => {
                        this.mUpdateListener({
                            source: this.userClassObject,
                            property: Symbol('any'),
                            stacktrace: Error().stack
                        });
                    });
                }
            });

            // Start observation on document.
            this.mMutationObserver.observe(document, {
                childList: true,
                subtree: true
            });
        });

        // Call everything inside component zone.
        this.updateHandler.execute(() => {

            // Add change detection listener
            this.updateHandler.enabled = true;

            // Before initialisation.
            this.mUserObjectHandler.callOnPwbInitialize();

            // Start initialize build.
            this.mRootBuilder.initializeBuild();
        });
    }

}