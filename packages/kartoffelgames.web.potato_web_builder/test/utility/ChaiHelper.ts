import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { Assertion } from 'chai';


Assertion.addMethod('componentStructure', function (pChilds: ComponentStructure, pUseShadowRoot: boolean) {
    const lRecreateElementStructure = <T extends InjectionConstructor | ChildNodeStructure>(pExpectedStructure: T, pActualNode: Node): T => {
        // Check if structure or constructor.
        if (typeof pExpectedStructure === 'function') {
            return <T><InjectionConstructor>pActualNode.constructor;
        } else {
            // Structure.
            const lExpectedStructure: ChildNodeStructure = pExpectedStructure;

            // Create new structure.
            const lNewStructure: ChildNodeStructure = {
                node: <InjectionConstructor>pActualNode.constructor
            };

            // Recreate child list.
            if ('childs' in lExpectedStructure) {
                if (pActualNode instanceof Element) {
                    if (lExpectedStructure.useShadowRoot) {
                        lNewStructure.childs = lRecreateComponentChildStructure(lExpectedStructure.childs, pActualNode.shadowRoot);
                    } else {
                        lNewStructure.childs = lRecreateComponentChildStructure(lExpectedStructure.childs, pActualNode);
                    }
                } else {
                    lNewStructure.childs = null;
                }
            }

            // Copy "useShadowRoot".
            if ('useShadowRoot' in lExpectedStructure) {
                lNewStructure.useShadowRoot = lExpectedStructure.useShadowRoot;
            }

            // Recreate attributes.
            if ('attributes' in lExpectedStructure) {
                if (pActualNode instanceof Element) {
                    // Create empty attribute list.
                    lNewStructure.attributes = new Array<{ name: string, value: string; }>();

                    // Try to add all expected attributes.
                    for (const lAttribute of lExpectedStructure.attributes) {
                        if (pActualNode.hasAttribute(lAttribute.name)) {
                            lNewStructure.attributes.push({
                                name: lAttribute.name,
                                value: pActualNode.getAttribute(lAttribute.name)
                            });
                        } else {
                            lNewStructure.attributes.push(null);
                        }
                    }
                } else {
                    lNewStructure.attributes = null;
                }
            }

            // Recreate text content.
            if('textContent' in lExpectedStructure){
                lNewStructure.textContent = pActualNode.textContent;
            }

            return <T>lNewStructure;
        }
    };

    const lRecreateComponentChildStructure = (pExpectedStructure: ComponentStructure, pActualElement: Element | ShadowRoot): ComponentStructure => {
        const lRecreatedStructureList: ComponentStructure = new Array<InjectionConstructor | ChildNodeStructure>();

        // Get max length of expected or actual childs.
        const lMaxChildCount: number = Math.max(pExpectedStructure.length, pActualElement.childNodes.length);

        // For each possible child.
        for (let lIndex: number = 0; lIndex < lMaxChildCount; lIndex++) {
            const lExpectedChild: InjectionConstructor | ChildNodeStructure = pExpectedStructure[lIndex] ?? null;
            const lActualChild: Node = pActualElement.childNodes[lIndex] ?? null;

            // Kepp null values.
            if (lExpectedChild === null || lActualChild === null) {
                lRecreatedStructureList.push(null);
            } else {
                // Try to recreate component structure.
                lRecreatedStructureList.push(lRecreateElementStructure(lExpectedChild, lActualChild));
            }
        }

        return lRecreatedStructureList;
    };

    let lActualStructure: ComponentStructure;
    if (pUseShadowRoot) {
        lActualStructure = lRecreateComponentChildStructure(pChilds, (<Element>this._obj).shadowRoot);
    } else {
        lActualStructure = lRecreateComponentChildStructure(pChilds, <Element>this._obj);
    }

    new Assertion(pChilds).to.be.deep.equal(lActualStructure);
});

export type ComponentStructure = Array<InjectionConstructor | ChildNodeStructure>;

export type ChildNodeStructure = {
    node: InjectionConstructor,
    useShadowRoot?: boolean;
    childs?: ComponentStructure;
    attributes?: Array<{ name: string, value: string; }>;
    textContent?: string;
};

declare global {
    export namespace Chai {
        interface Assertion {
            componentStructure(pChilds: ComponentStructure, pUseShadowRoot: boolean): void;
        }
    }
}