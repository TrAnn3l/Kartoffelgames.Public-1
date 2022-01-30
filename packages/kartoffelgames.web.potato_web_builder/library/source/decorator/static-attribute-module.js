"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticAttributeModule = void 0;
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const attribute_module_access_type_1 = require("../enum/attribute-module-access-type");
const module_type_1 = require("../enum/module-type");
const module_storage_1 = require("../module/module-storage");
/**
 * AtScript. PWB static attribute module.
 * @param pSettings - Module settings.
 */
function StaticAttributeModule(pSettings) {
    // Needs constructor without argument.
    return (pStaticModuleConstructor) => {
        var _a;
        // Set user class to be injectable
        core_dependency_injection_1.Injector.Injectable(pStaticModuleConstructor);
        /**
         * Inherit base constructor and extend by access modifier.
         */
        const lStaticAttributeModule = (_a = class {
                /**
                 * Constructor.
                 * @param pArgs - Arguments for inner module object.
                 */
                constructor(...pArgs) {
                    this.mModuleObject = new pStaticModuleConstructor(...pArgs);
                }
                /**
                 * Cleanup events and other data that does not delete itself.
                 * Added data to the values handler cleanup itself.
                 */
                cleanup() {
                    this.onCleanup();
                }
                /**
                 * Cleanup events and other data that does not delete itself.
                 * Added data to the values handler cleanup itself
                 */
                onCleanup() {
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
                onProcess() {
                    if (typeof this.mModuleObject.onProcess === 'function') {
                        this.mModuleObject.onProcess();
                    }
                }
                /**
                 * Called on update.
                 * Should never recreate the DOM.
                 * Result doesn't matter.
                 */
                onUpdate() {
                    if (typeof this.mModuleObject.onUpdate === 'function') {
                        return this.mModuleObject.onUpdate();
                    }
                    return false;
                }
                /**
                 * Processes the module.
                 */
                process() {
                    this.onProcess();
                }
                /**
                 * Update data related to this attribute module.
                 * @returns if the complete component should be updated.
                 */
                update() {
                    return this.onUpdate();
                }
            },
            /**
             * Modules access type.
             */
            _a.accessType = pSettings.accessType,
            /**
             * Selector of attributes the modules gets applied.
             */
            _a.attributeSelector = pSettings.attributeSelector,
            /**
             * If module is forbidden inside manipulator scopes.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            _a.forbiddenInManipulatorScopes = pSettings.forbiddenInManipulatorScopes,
            /**
             * If modules reads data into the view.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            _a.isReading = (pSettings.accessType & attribute_module_access_type_1.AttributeModuleAccessType.Read) === attribute_module_access_type_1.AttributeModuleAccessType.Read,
            /**
             * If modules writes data out of the view.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            _a.isWriting = (pSettings.accessType & attribute_module_access_type_1.AttributeModuleAccessType.Write) === attribute_module_access_type_1.AttributeModuleAccessType.Write,
            /**
             * If module removes or adds attributes to the provided template element.
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            _a.manipulatesAttributes = pSettings.manipulatesAttributes,
            /**
             * This module type.
             */
            _a.moduleType = module_type_1.ModuleType.Static,
            _a);
        // Add module to storage.
        module_storage_1.ModuleStorage.addModule(lStaticAttributeModule);
        return lStaticAttributeModule;
    };
}
exports.StaticAttributeModule = StaticAttributeModule;
//# sourceMappingURL=static-attribute-module.js.map