import { Exception } from '@kartoffelgames/core.data';
import { ComponentConnection } from '../../component/component-connection';
import { ComponentManager } from '../../component/component-manager';
import { UserObject } from '../../component/interface/user-class';

/**
 * AtScript. Id child 
 * @param pIdChildName - Name of id child.
 */
export function PwbChild(pIdChildName: string): any {
    return (pTarget: object, pPropertyKey: string) => {
        // Check if real decorator on static property.
        if (typeof pTarget === 'function') {
            throw new Exception('Event target is not for a static property.', PwbChild);
        }

        // Define getter accessor that returns id child.
        Object.defineProperty(pTarget, pPropertyKey, {
            get(this: UserObject) {
                // Get component manager and exit if target is not a component.
                const lComponentManager: ComponentManager|undefined = ComponentConnection.componentManagerOf(this);
                if(!lComponentManager){
                    throw new Exception('Target is not a Component', this);
                }

                // Get root value. This should be the child.
                const lIdChild: any = lComponentManager.rootValues.getValue(pIdChildName);

                if (lIdChild instanceof Element) {
                    return lIdChild;
                } else {
                    throw new Exception(`Can't find child "${pIdChildName}".`, this);
                }
            }
        });
    };
}