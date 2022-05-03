import { UpdateHandler } from '../component/handler/update-handler';

export class ComponentUpdateReference {
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Constructor.
     * @param pUpdateHandler - Update handler.
     */
    public constructor(pUpdateHandler: UpdateHandler) {
        this.mUpdateHandler = pUpdateHandler;
    }

    /**
     * Update component manually.
     */
    public update(): void {
        // Call update component just in case of manual updating.
        this.mUpdateHandler.forceUpdate({
            source: this,
            property: Symbol('manual update'),
            stacktrace: <string>Error().stack
        });
    }
}