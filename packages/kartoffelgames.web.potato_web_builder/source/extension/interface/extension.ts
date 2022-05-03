/* eslint-disable @typescript-eslint/no-empty-interface */

// Component extension.
export interface IPwbExtensionObject extends IPwbExtensionOnDeconstruct, IPwbExtensionOnCollectInjections { }
export interface IPwbExtensionClass {
    new(): IPwbExtensionObject;
}

export interface IPwbExtensionOnDeconstruct {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onDeconstruct(): void;
}

export interface IPwbExtensionOnCollectInjections {
    /**
     * Collect all injections.
     * Injection type is aquired by Object.constructor
     */
    onCollectInjections(): Array<object | null>;
}

