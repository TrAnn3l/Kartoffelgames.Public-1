import { UserClassConstructor } from '../../../source/interface/user-class';

export class MenuConfiguration {
    private readonly mAdditionalContent: Array<any | UserClassConstructor>;
    private readonly mLogo: string | UserClassConstructor;
    private readonly mNavigationList: Array<MenuNavigation>;

    /**
     * Get additional content list.
     */
    public get additionalContentList(): Array<any | UserClassConstructor> {
        return this.mAdditionalContent;
    }

    /**
     * Get page ogo.
     */
    public get logo(): string | UserClassConstructor {
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
    public constructor(pLogo: string | UserClassConstructor) {
        this.mNavigationList = new Array<MenuNavigation>();
        this.mAdditionalContent = new Array<any | UserClassConstructor>();
        this.mLogo = pLogo;
    }

    /**
     * Add additional content.
     * @param pElementConstructor - Element constructor.
     */
    public addAdditional(pElementConstructor: any | UserClassConstructor): void {
        this.mAdditionalContent.push(pElementConstructor);
    }

    /**
     * Add navigation.
     * @param pText - Navigation text.
     * @param pIcon - Icon of navigation icon.
     * @param pPath - Path.
     */
    public addNavigation(pText: string, pIcon: any | UserClassConstructor, pPath: string): void {
        this.mNavigationList.push({
            path: pPath,
            icon: pIcon,
            text: pText
        });
    }
}

type MenuNavigation = {
    path: string,
    icon: any | UserClassConstructor,
    text: string;
};
