import { BaseXmlNode } from '@kartoffelgames/core.xml';

export interface IPwbSlotAssign {
    assignSlotContent(pTemplate: BaseXmlNode): string;
}

export interface IPwbOnInit {
    onPwbInitialize(): void;
}

export interface IPwbOnDeconstruct {
    onPwbDeconstruct(): void;
}

export interface IPwbAfterInit {
    afterPwbInitialize(): void;
}

export interface IPwbAfterUpdate {
    afterPwbUpdate(): void;
}

export interface IPwbOnUpdate {
    onPwbUpdate(): void;
}

export interface IPwbOnAttributeChange{
    onPwbAttributeChange(pAttributeName: string): void;
}