import { Injector } from '@kartoffelgames/core.dependency-injection';
import { AttributeModuleAccessType } from '../enum/attribute-module-access-type';
import { ModuleType } from '../enum/module-type';
import { AttributeModuleSettings } from '../interface/attribute-module';
import { IPwbManipulatorAttributeModule, PwbManipulatorAttributeModuleConstructor } from '../interface/manipulator-attribute-module';
import { ModuleManipulatorResult } from '../module/base/module-manipulator-result';
import { ModuleStorage } from '../module/module-storage';

/**
 * AtScript. PWB Manipulator attribute module.
 * @param pSettings - Module settings.
 */
export function ManipulatorAttributeModule(pSettings: AttributeModuleSettings): any {

    // Needs constructor without argument.
    return (pManipulatorModuleConstructor: PwbManipulatorAttributeModuleConstructor) => {

        // Set user class to be injectable
        Injector.Injectable(pManipulatorModuleConstructor);

        /**
         * Inherit base constructor and extend by access modifier.
         */
        const lManipulatorAttributeModule: PwbManipulatorAttributeModuleConstructor = class implements IPwbManipulatorAttributeModule {
            /**
             * Modules access type.
             */
            public static readonly accessType: AttributeModuleAccessType = pSettings.accessType;

            /**
             * Selector of attributes the modules gets applied.
             */
            public static readonly attributeSelector: RegExp = pSettings.attributeSelector;

            /**
             * If module is forbidden inside manipulator scopes.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            public static readonly forbiddenInManipulatorScopes: boolean = pSettings.forbiddenInManipulatorScopes;

            /**
             * If modules reads data into the view.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            public static readonly isReading: boolean = (pSettings.accessType & AttributeModuleAccessType.Read) === AttributeModuleAccessType.Read;

            /**
             * If modules writes data out of the view.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            public static readonly isWriting: boolean = (pSettings.accessType & AttributeModuleAccessType.Write) === AttributeModuleAccessType.Write;

            /**
             * If module removes or adds attributes to the provided template element.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            public static readonly manipulatesAttributes: boolean = pSettings.manipulatesAttributes;

            /**
             * This module type.
             */
            public static readonly moduleType: ModuleType.Manipulator = ModuleType.Manipulator;

            private readonly mModuleObject: IPwbManipulatorAttributeModule;

            /**
             * Constructor.
             * @param pArgs - Arguments for inner module object.
             */
            public constructor(...pArgs: Array<any>) {
                this.mModuleObject = new (<any>pManipulatorModuleConstructor)(...pArgs);
            }

            /**
             * Processes the module for the provided target. 
             * No DOM manipulation, adding or removing complete Elements, are allowed. 
             * Adding or removing attributes is allowed. 
             * Removes the xml attribute from the template.
             */
            public onProcess(): ModuleManipulatorResult {
                if (typeof this.mModuleObject.onProcess === 'function') {
                    return this.mModuleObject.onProcess();
                }

                return new ModuleManipulatorResult();
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
            public process(): ModuleManipulatorResult {
                return this.onProcess();
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
        ModuleStorage.addModule(lManipulatorAttributeModule);

        return lManipulatorAttributeModule;
    };
}