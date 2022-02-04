import { ComponentEventEmitter } from '../../user_class_manager/component-event-emitter';
import { UserObjectHandler } from './user-object-handler';
export declare class UserEventHandler {
    private readonly mUserObjectHandler;
    /**
     * Constructor.
     * @param pUserObjectHandler - User object handler.
     */
    constructor(pUserObjectHandler: UserObjectHandler);
    /**
     * Get event emitter from user class object.
     * @param pEventName - Name of event.
     */
    getEventEmitter(pEventName: string): ComponentEventEmitter<any> | undefined;
}
//# sourceMappingURL=user-event-handler.d.ts.map