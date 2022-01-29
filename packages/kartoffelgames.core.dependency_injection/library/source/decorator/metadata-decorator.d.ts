import { InjectionConstructor } from '..';
/**
 * AtScript.
 * Add metadata to class, method, accessor or property
 * @param pMetadataKey - Key of metadata.
 * @param pMetadataValue - Value of metadata.
 */
export declare function MetadataDecorator<T>(pMetadataKey: string, pMetadataValue: T): (pTarget: object | InjectionConstructor, pProperty?: string | symbol) => void;
//# sourceMappingURL=metadata-decorator.d.ts.map