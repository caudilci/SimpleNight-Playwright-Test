import { expect, type Locator, type Page } from '@playwright/test';

export class PlaywrightHomeHotelsPage {
    readonly page: Page;
    readonly baseURL: string;

    constructor(page: Page, baseURL: string) {
        this.page = page;
        this.baseURL = baseURL;
    }

    async populateDestinationField(input: string): Promise<void> {
        await this.page.getByRole('button', { name: 'Destination' }).click();
        await this.page.getByPlaceholder('Where are you going?').fill(input);
    }

    async selectDestination(input: string): Promise<void> {
        await this.page.getByRole('button', { name: input }).click();
    }

    async selectDates(from: { day: number, month: number, year: number }, to: { day: number, month: number, year: number }): Promise<void> {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November'
        ];
        const currentDate = new Date();
        const currentMonth = months[currentDate.getUTCMonth()];
        const currentYear = currentDate.getUTCFullYear();
        const fromMonth = months[from.month - 1];
        const toMonth = months[to.month - 1];
        await this.page.getByTestId('category(static:hotels)_search-form_dates_trigger').click();
        await this.page.getByRole('button', { name: `${currentMonth} ${currentYear}`, exact: true }).click();
        await this.page.getByRole('button', { name: String(currentYear) }).click();
        await this.page.getByRole('button', { name: String(from.year) }).click();
        await this.page.getByRole('button', { name: fromMonth }).click();
        await this.page.getByRole('button', { name: `${from.day} ${fromMonth}` }).click();
        await this.page.getByRole('button', { name: `${from.day} ${fromMonth}` }).click(); // click twice to set start date
        await this.page.getByRole('button', { name: `${fromMonth} ${currentYear}`, exact: true }).click();
        await this.page.getByRole('button', { name: toMonth }).click();
        await this.page.getByRole('button', { name: `${to.day} ${toMonth}` }).click();
        const applyButton = this.page.getByRole('button', { name: 'Apply' });
        await applyButton.scrollIntoViewIfNeeded();
        await this.page.mouse.wheel(0, 100); // wouldn't be needed if scrollIntoViewIfNeeded worked properly
        await applyButton.click();
    }

    async addGuests(adults: number, children: number): Promise<void> {
        await this.page.getByTestId('category(static:hotels)_search-form_guests_trigger').click();
        for (let i = 0; i < adults - 1; i++) {
            await this.page.getByLabel('Add Adult').click();
        }
        for (let i = 0; i < children; i++) {
            await this.page.getByLabel('Add Child').click();
        }
    }

    async search(): Promise<void> {
        await this.page.getByRole('button', { name: 'Search' }).click();
    }
}