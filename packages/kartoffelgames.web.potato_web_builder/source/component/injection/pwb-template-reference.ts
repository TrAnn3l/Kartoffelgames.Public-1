import { BaseXmlNode } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../component-manager';

export class PwbTemplateReference {
    private readonly mTemplate: BaseXmlNode;

    /**
     * Get template reference.
     */
    public get template(): BaseXmlNode {
        return this.mTemplate;
    }

    /**
     * Constructor.
     * @param pTemplate - Template.
     */
    public constructor(pTemplate: BaseXmlNode) {
        this.mTemplate = pTemplate;
    }
}