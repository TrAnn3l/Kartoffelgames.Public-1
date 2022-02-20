import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { Assertion } from 'chai';


Assertion.addMethod('componentStructure', function (pChilds: ComponentStructure, pUseShadowRoot: boolean) {
    const lCreateMap = (pComponent: Element, pExpectedChilds: ComponentStructure, pUseShadowRoot: boolean): ComponentStructure => {
        const lChildList = (pUseShadowRoot) ? pComponent.shadowRoot.childNodes : pComponent.childNodes;
        const lActualStucture: ComponentStructure = new Array<InjectionConstructor | ChildNodeStructure>();

        // Check each index of child node.
        for (let lIndex: number = 0; lIndex < lChildList.length || lIndex < pExpectedChilds.length; lIndex++) {
            // Get actual class.
            let lActualClass: InjectionConstructor;
            let lActualNode: Node;
            if (lIndex < lChildList.length) {
                lActualClass = <InjectionConstructor>lChildList[lIndex].constructor;
                lActualNode = lChildList[lIndex];
            } else {
                lActualClass = null;
                lActualNode = null;
            }

            // Get expected child class and strcture.
            let lExpectedClass: InjectionConstructor;
            let lExpectedStructure: ChildNodeStructure;
            if (lIndex < pExpectedChilds.length) {
                if (typeof pExpectedChilds[lIndex] === 'function') {
                    lExpectedClass = <InjectionConstructor>pExpectedChilds[lIndex];
                    lExpectedStructure = null;
                } else {
                    lExpectedClass = (<ChildNodeStructure>pExpectedChilds[lIndex]).node;
                    lExpectedStructure = <ChildNodeStructure>pExpectedChilds[lIndex];
                }
            } else {
                lExpectedClass = null;
                lExpectedStructure = null;
            }

            if (lExpectedClass === null) {
                lActualStucture.push(null);
            } else if (lExpectedStructure) {
                if (lActualNode instanceof Element) {
                    const lStructure: ChildNodeStructure = {
                        node: lActualClass,
                        childs: lCreateMap(lActualNode, lExpectedStructure.childs, lExpectedStructure.useShadowRoot)
                    };

                    if ('useShadowRoot' in lExpectedStructure) {
                        lStructure.useShadowRoot = lExpectedStructure.useShadowRoot;
                    }

                    lActualStucture.push(lStructure);
                } else {
                    lActualStucture.push(lActualClass);
                }
            } else {
                lActualStucture.push(lActualClass);
            }
        }

        return lActualStucture;
    };

    const lActualStructure: ComponentStructure = lCreateMap(this._obj, pChilds, pUseShadowRoot);
    new Assertion(pChilds).to.be.deep.equal(lActualStructure);
});

export type ComponentStructure = Array<InjectionConstructor | ChildNodeStructure>;

export type ChildNodeStructure = {
    node: InjectionConstructor,
    useShadowRoot?: boolean;
    childs: ComponentStructure;
};

declare global {
    export namespace Chai {
        interface Assertion {
            componentStructure(pChilds: ComponentStructure, pUseShadowRoot: boolean): void;
        }
    }
}