import { Extension } from '../../extension/decorator/extension.decorator';
import { ExtensionType } from '../../extension/enum/extension-type';

@Extension({
    type: ExtensionType.Component | ExtensionType.Module
})
export class EventListenerExtension {

}