import { UserClass } from '../../../source/interface/user-class';

export class HeadConfiguration {
    private readonly mAdditionalContent: Array<any | UserClass>;
    private readonly mLogo: string | UserClass;
    private mSearchbarConfiguration: SearchbarConfiguration | null;

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
     * Get searchbar configuration.
     */
    public get searchbar(): SearchbarConfiguration | null {
        return this.mSearchbarConfiguration;
    }

    /**
     * Set searchbar configuration.
     */
    public set searchbar(pSearchbarConfiguration: SearchbarConfiguration | null) {
        this.mSearchbarConfiguration = pSearchbarConfiguration;
    }

    /**
     * Constructor.
     * @param pLogo - Site logo.
     */
    public constructor(pLogo: string | UserClass) {
        this.mLogo = pLogo;
        this.mAdditionalContent = new Array<any | UserClass>();
    }


    /**
     * Add additional content.
     * @param pElementConstructor - Element constructor.
     */
    public addAdditional(pElementConstructor: any | UserClass): void {
        this.mAdditionalContent.push(pElementConstructor);
    }
}

export type SearchbarConfiguration = {
    placeholder: string;
    list?: Array<string>;
};