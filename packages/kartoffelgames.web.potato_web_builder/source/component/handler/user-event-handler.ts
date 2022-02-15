import { Dictionary } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { MetadataKey } from '../../metadata-key';
import { ComponentEventEmitter } from '../../user_class_manager/component-event-emitter';
import { UserObjectHandler } from './user-object-handler';

export class UserEventHandler {
    private readonly mUserObjectHandler: UserObjectHandler;

    /**
     * Constructor.
     * @param pUserObjectHandler - User object handler.
     */
    public constructor(pUserObjectHandler: UserObjectHandler) {
        this.mUserObjectHandler = pUserObjectHandler;
    }

    /**
     * Get event emitter from user class object.
     * @param pEventName - Name of event.
     */
    public getEventEmitter(pEventName: string): ComponentEventEmitter<any> | undefined {
        // Get event properties from metadata.
        const lEventPropertyList: Dictionary<string, string> = Metadata.get(this.mUserObjectHandler.userClass).getMetadata(MetadataKey.METADATA_USER_EVENT_PROPERIES);

        if (lEventPropertyList) {
            // When event was set. 
            const lEventProperty: string = lEventPropertyList.get(pEventName);
            if (typeof lEventProperty === 'string') {
                const lEventEmitter: ComponentEventEmitter<any> = Reflect.get(this.mUserObjectHandler.userObject, lEventProperty);

                // When event is event emitter.
                if (lEventEmitter instanceof ComponentEventEmitter) {
                    return lEventEmitter;
                }
            }
        }

        // Fallback to undefined.
        return undefined;
    }
}