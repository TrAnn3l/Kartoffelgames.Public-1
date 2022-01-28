import { Dictionary } from '@kartoffelgames/core.data';
import { DecorationHistory } from '../reflect/decoration-history';
import { InjectionConstructor } from '../type';
import { ConstructorMetadata } from './constructor-metadata';

/**
 * Static.
 * Metadata storage.
 */
export class Metadata {
    private static readonly mConstructorMetadata: Dictionary<InjectionConstructor, ConstructorMetadata> = new Dictionary<InjectionConstructor, ConstructorMetadata>();

    /**
     * Get metadata of constructor.
     */
    public static get(pConstructor: InjectionConstructor): ConstructorMetadata {
        // Find registered constructor that has the metadata information.
        const lHistory: Array<InjectionConstructor> = DecorationHistory.getBackwardHistoryOf(pConstructor);
        const lRegisteredConstructor: InjectionConstructor = lHistory.find((pConstructorHistory: InjectionConstructor) => {
            return Metadata.mConstructorMetadata.has(pConstructorHistory);
        });

        // Create new or get metadata.
        let lMetadata: ConstructorMetadata;
        if (!lRegisteredConstructor) {
            lMetadata = new ConstructorMetadata();
            Metadata.mConstructorMetadata.add(pConstructor, lMetadata);
        } else {
            lMetadata = Metadata.mConstructorMetadata.get(lRegisteredConstructor);
        }

        return lMetadata;
    }
}