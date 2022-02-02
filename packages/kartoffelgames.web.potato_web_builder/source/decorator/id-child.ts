import { Exception } from '@kartoffelgames/core.data';
import { UserClassObject } from '../interface/user-class';

/**
 * AtScript. Id child 
 * @param pIdChildName - Name of id child.
 */
export function IdChild(pIdChildName: string): any {
    return (pTarget: object, pPropertyKey: string) => {
        // Check if real decorator on static property.
        if (typeof pTarget === 'function') {
            throw new Exception('Event target is not for a static property.', IdChild);
        }

        // Define getter accessor that returns id child.
        Object.defineProperty(pTarget, pPropertyKey, {
            get(this: UserClassObject) {
                const lIdChild: any = this.componentHandler.rootValues.getTemporaryValue(pIdChildName);

                if (lIdChild instanceof Element) {
                    return lIdChild;
                } else {
                    throw new Exception(`Can't find IdChild "${pIdChildName}".`, this);
                }
            }
        });
    };
}