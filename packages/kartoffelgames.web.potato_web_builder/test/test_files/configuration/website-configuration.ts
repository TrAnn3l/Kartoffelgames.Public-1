import { UserClassConstructor } from '../../../source/interface/user-class';
import { ColorConfiguration } from './color-configuration';
import { HeadConfiguration } from './head-configuration';
import { MenuConfiguration } from './menu-configuration';

export class WebsiteConfiguration {
    private readonly mColors: ColorConfiguration;
    private readonly mContent: ContentConfiguration;

    /**
     * Color configuration.
     * Changing after building page does not update the colors.
     */
    public get colors(): ColorConfiguration {
        return this.mColors;
    }

    /**
     * Get content configuration.
     */
    public get content(): ContentConfiguration {
        return this.mContent;
    }

    /**
     * Constructor.
     * Create configuration for the entire page.
     * @param pNavigation - Page navigation.
     * @param pColors - Colors of page.
     */
    public constructor( pLogo: string | UserClassConstructor, pColors: ColorConfiguration) {
        this.mColors = pColors;
        
        this.mContent = {
            head: new HeadConfiguration(pLogo),
            menu: new MenuConfiguration(pLogo)
        };
    }
}

type ContentConfiguration = {
    head: HeadConfiguration,
    menu: MenuConfiguration,
};
