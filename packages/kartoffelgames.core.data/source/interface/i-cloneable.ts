/**
 * ICloneable interface
 */
export interface ICloneable<T> {
    /**
     * Copy first layer of object.
     */
    clone(): T;
}