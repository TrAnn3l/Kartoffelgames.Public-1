import { InjectionConstructor } from '../type';
import { ConstructorMetadata } from './constructor-metadata';
/**
 * Static.
 * Metadata storage.
 */
export declare class Metadata {
    private static readonly mConstructorMetadata;
    /**
     * Get metadata of constructor.
     */
    static get(pConstructor: InjectionConstructor): ConstructorMetadata;
}
//# sourceMappingURL=metadata.d.ts.map