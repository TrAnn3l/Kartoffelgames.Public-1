/* eslint-disable @typescript-eslint/no-empty-interface */

// Component extension.
export interface IPwbExtensionObject extends IPwbExtensionOnDeconstruct { }
export interface IPwbExtensionClass {
    new(): IPwbExtensionObject;
}

export interface IPwbExtensionOnDeconstruct {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onDeconstruct(): void;
}