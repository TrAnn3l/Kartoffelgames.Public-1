import { UserClass } from '../../../source/interface/user-class';

export class MenuConfiguration {
    private readonly mAdditionalContent: Array<any | UserClass>;
    private readonly mLogo: string | UserClass;
    private readonly mNavigationList: Array<MenuNavigation>;

    /**
     * Get additional content list.
     */
    public get additionalContentList(): Array<any | UserClass> {
        return this.mAdditionalContent;
    }

    /**
     * Get page ogo.
     */
    public get logo(): string | UserClass {
        return this.mLogo;
    }

    /**
     * Get navigation element list.
     */
    public get navigationList(): Array<MenuNavigation> {
        return this.mNavigationList;
    }

    /**
     * Constructor.
     * @param pLogo - Site logo.
     */
    public constructor(pLogo: string | UserClass) {
        this.mNavigationList = new Array<MenuNavigation>();
        this.mAdditionalContent = new Array<any | UserClass>();
        this.mLogo = pLogo;
    }

    /**
     * Add additional content.
     * @param pElementConstructor - Element constructor.
     */
    public addAdditional(pElementConstructor: any | UserClass): void {
        this.mAdditionalContent.push(pElementConstructor);
    }

    /**
     * Add navigation.
     * @param pText - Navigation text.
     * @param pIcon - Icon of navigation icon.
     * @param pPath - Path.
     */
    public addNavigation(pText: string, pIcon: any | UserClass, pPath: string): void {
        this.mNavigationList.push({
            path: pPath,
            icon: pIcon,
            text: pText
        });
    }
}

type MenuNavigation = {
    path: string,
    icon: any | UserClass,
    text: string;
};
