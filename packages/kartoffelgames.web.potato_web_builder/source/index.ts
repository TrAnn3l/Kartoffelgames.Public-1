// Component
export { UserObject, UserClass } from './component/interface/user-class';
export { PwbApp } from './pwb-app';
export { IPwbOnInit, IPwbAfterInit, IPwbOnDeconstruct, IPwbSlotAssign, IPwbAfterUpdate, IPwbOnUpdate, IPwbOnAttributeChange } from './component/interface/user-class';
export { PwbComponent } from './component/decorator/pwb-component.decorator';

// Injections
export { ComponentElementReference } from './injection_reference/component-element-reference';
export { ComponentUpdateReference } from './injection_reference/component-update-reference';
export { ComponentManagerReference } from './injection_reference/component-manager-reference';
export { ExtensionTargetClassReference } from './injection_reference/extension-target-class-reference';
export { ExtensionTargetObjectReference } from './injection_reference/extension-target-object-reference';
export { ModuleAttributeReference } from './injection_reference/module-attribute-reference';
export { ModuleExpressionReference } from './injection_reference/module-expression-reference';
export { ModuleLayerValuesReference } from './injection_reference/module-layer-values-reference';
export { ModuleTargetReference } from './injection_reference/module-target-reference';
export { ModuleTemplateReference } from './injection_reference/module-template-reference';

// Modules
export { ComponentScopeExecutor } from './module/execution/component-scope-executor';
export { IPwbExpressionModuleOnUpdate, IPwbStaticModuleOnUpdate, IPwbMultiplicatorModuleOnUpdate, IPwbModuleOnDeconstruct } from './module/interface/module';
export { ModuleAccessType } from './module/enum/module-access-type';
export { LayerValues } from './component/values/layer-values';
export { MultiplicatorResult } from './module/result/multiplicator-result';
export { PwbExpressionModule } from './module/decorator/pwb-expression-module.decorator';
export { PwbMultiplicatorAttributeModule } from './module/decorator/pwb-multiplicator-attribute-module.decorator';
export { PwbStaticAttributeModule } from './module/decorator/pwb-static-attribute-module.decorator';

// Extension
export { PwbExtension } from './extension/decorator/pwb-extension.decorator';
export { IPwbExtensionOnDeconstruct } from './extension/interface/extension';

// Default extensions.
export { ComponentEvent } from './default/component-event/component-event';
export { ComponentEventEmitter } from './default/component-event/component-event-emitter';
export { PwbComponentEvent } from './default/component-event/pwb-component-event.decorator';
export { PwbChild } from './default/pwb_child/pwb-child.decorator';
export { PwbExport } from './default/export/pwb-export.decorator';
export { PwbEventListener } from './default/event-listener/pwb-event-listener.decorator';

// Xml
export { TemplateParser } from './component/parser/template-parser';
export { TextNode, XmlElement, XmlAttribute } from '@kartoffelgames/core.xml';