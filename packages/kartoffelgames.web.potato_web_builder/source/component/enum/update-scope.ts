export enum UpdateScope {
    /**
     * Update on every change inside app.
     */
    Global = 1,
    /**
     * Update on every changes inside component.
     * Better performance but not every change is covered.
     */
    Capsuled = 2,
    /**
     * Only update manually.
     */
    Manual = 3
}