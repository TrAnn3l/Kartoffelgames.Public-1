/**
 * Access types of attribute module.
 */
export enum ModuleAccessType {
    /**
     * Module reads information from view.
     */
    Read = 1,

    /**
     * Module writes into view.
     */
    Write = 2,

    /**
     * Module read from view and writes into view.
     */
    ReadWrite = 3
}