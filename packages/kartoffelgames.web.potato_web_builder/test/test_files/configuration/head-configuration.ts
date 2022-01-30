import { UserClassConstructor } from '../../../source/interface/user-class';

export class HeadConfiguration {
    private readonly mAdditionalContent: Array<any | UserClassConstructor>;
    private readonly mLogo: string | UserClassConstructor;
    private mSearchbarConfiguration: SearchbarConfiguration | null;

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
    public constructor(pLogo: string | UserClassConstructor) {
        this.mLogo = pLogo;
        this.mAdditionalContent = new Array<any | UserClassConstructor>();
    }


    /**
     * Add additional content.
     * @param pElementConstructor - Element constructor.
     */
    public addAdditional(pElementConstructor: any | UserClassConstructor): void {
        this.mAdditionalContent.push(pElementConstructor);
    }
}

export type SearchbarConfiguration = {
    placeholder: string;
    list?: Array<string>;
};