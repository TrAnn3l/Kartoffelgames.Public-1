import { Injector } from '@kartoffelgames/core.dependency-injection';
import { ComponentModules } from '../../module/component-modules_old';
import { ModuleAccessType } from '../../enum/module-access-type';
import { ModuleType } from '../../enum/module-type';
import { AttributeModuleSettings } from '../../interface/module/attribute-module';
import { IPwbStaticAttributeModule, PwbStaticAttributeModuleConstructor } from '../../interface/module';

/**
 * AtScript. PWB static attribute module.
 * @param pSettings - Module settings.
 */
export function StaticAttributeModule(pSettings: AttributeModuleSettings): any {

    // Needs constructor without argument.
    return (pStaticModuleConstructor: PwbStaticAttributeModuleConstructor) => {

        // Set user class to be injectable
        Injector.Injectable(pStaticModuleConstructor);

        /**
         * Inherit base constructor and extend by access modifier.
         */
        const lStaticAttributeModule: PwbStaticAttributeModuleConstructor = class implements IPwbStaticAttributeModule {
            /**
             * Modules access type.
             */
            static readonly accessType: ModuleAccessType = pSettings.accessType;

            /**
             * Selector of attributes the modules gets applied.
             */
            static readonly attributeSelector: RegExp = pSettings.attributeSelector;

            /**
             * If module is forbidden inside manipulator scopes.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            static readonly forbiddenInManipulatorScopes: boolean = pSettings.forbiddenInManipulatorScopes;

            /**
             * If modules reads data into the view.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            static readonly isReading: boolean = (pSettings.accessType & ModuleAccessType.Read) === ModuleAccessType.Read;

            /**
             * If modules writes data out of the view.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            static readonly isWriting: boolean = (pSettings.accessType & ModuleAccessType.Write) === ModuleAccessType.Write;

            /**
             * If module removes or adds attributes to the provided template element.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            static readonly manipulatesAttributes: boolean = pSettings.manipulatesAttributes;

            /**
             * This module type.
             */
            static readonly moduleType: ModuleType.Static = ModuleType.Static;

            private readonly mModuleObject: IPwbStaticAttributeModule;

            /**
             * Constructor.
             * @param pArgs - Arguments for inner module object.
             */
            public constructor(...pArgs: Array<any>) {
                this.mModuleObject = new (<any>pStaticModuleConstructor)(...pArgs);
            }

            /**
             * Cleanup events and other data that does not delete itself.
             * Added data to the values handler cleanup itself.
             */
            public cleanup(): void {
                this.onCleanup();
            }

            /**
             * Cleanup events and other data that does not delete itself. 
             * Added data to the values handler cleanup itself
             */
            public onCleanup(): void {
                if (typeof this.mModuleObject.onCleanup === 'function') {
                    this.mModuleObject.onCleanup();
                }
            }

            /**
             * Processes the module for the provided target. 
             * No DOM manipulation, adding or removing complete Elements, are allowed. 
             * Adding or removing attributes is allowed. 
             * Removes the xml attribute from the template.
             */
            public onProcess(): void {
                if (typeof this.mModuleObject.onProcess === 'function') {
                    this.mModuleObject.onProcess();
                }
            }

            /**
             * Called on update. 
             * Should never recreate the DOM. 
             * Result doesn't matter.
             */
            public onUpdate(): boolean {
                if (typeof this.mModuleObject.onUpdate === 'function') {
                    return this.mModuleObject.onUpdate();
                }

                return false;
            }

            /**
             * Processes the module.
             */
            public process(): void {
                this.onProcess();
            }

            /**
             * Update data related to this attribute module.
             * @returns if the complete component should be updated.
             */
            public update(): boolean {
                return this.onUpdate();
            }
        };

        // Add module to storage.
        ComponentModules.addModule(lStaticAttributeModule);

        return lStaticAttributeModule;
    };
}