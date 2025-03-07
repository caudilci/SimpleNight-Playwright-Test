import { expect, type Locator, type Page } from '@playwright/test';

export class PlaywrightHomePage {
    readonly page: Page;
    readonly baseURL: string;

    constructor(page: Page, baseURL: string) {
        this.page = page;
        this.baseURL = baseURL;
    }

    async goto(): Promise<void> {
        await this.page.goto(this.baseURL);
    }

    async selectHotelsCategory(): Promise<void> {
        await this.page.getByRole('link', { name: 'Hotels'}).click();
    }
}