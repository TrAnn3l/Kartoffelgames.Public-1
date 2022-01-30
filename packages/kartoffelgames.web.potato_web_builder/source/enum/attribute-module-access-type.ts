/**
 * Access types of attribute module.
 */
export enum AttributeModuleAccessType {
    /**
     * Module reads information from view.
     */
    Read = 1,

    /**
     * Module writes into value object.
     */
    Write = 2,

    /**
     * Module read into view and writes into value object.
     */
    ReadWrite = 4
}