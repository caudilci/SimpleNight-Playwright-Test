import { expect, type Locator, type Page } from '@playwright/test';

export class PlaywrightHomeHotelsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Clicks Destination field and fills field with input string
     * @param input string input to populate the Destination field
     */
    async populateDestinationField(input: string): Promise<void> {
        await this.page.getByRole('button', { name: 'Destination' }).click();
        await this.page.getByPlaceholder('Where are you going?').fill(input);
    }

    /**
     * Clicks Destination option corresponding with provided destinationName
     * @param destinationName string containing the name of the Destination as shown in search suggestions
     */
    async selectDestination(destinationName: string): Promise<void> {
        await this.page.getByRole('button', { name: destinationName }).click();
    }

    /**
     * Interacts and selects dates in the Dates field
     * @remarks This could break depending on timezone if performed on the last or first day of the month or year. Additionally
     *          should the months need to be used elsewhere, extracting that bit out might be waranted. I realize that this can
     *          be done with the toLocalString from dates but I wanted to minimize the risk of timezone based flakiness. Lastly,
     *          scrollIntoView appears to have some issues. I wouldn't normally just want to use a magic number to scroll by.
     * @param from object containing numbers corresponding to date, month, and year the trip will start on
     * @param to object containing numbers corresponding to date, month, and year the trip will end on
     */
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
        const currentMonth = months[currentDate.getMonth()];
        const currentYear = currentDate.getFullYear();
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

    /**
     * Clicks the Add Adult and Add Child buttons based on adults and children values
     * @param adults amount of adults to add
     * @param children amount of children to add
     */
    async addGuests(adults: number, children: number): Promise<void> {
        await this.page.getByTestId('category(static:hotels)_search-form_guests_trigger').click();
        for (let i = 0; i < adults - 1; i++) {
            await this.page.getByLabel('Add Adult').click();
        }
        for (let i = 0; i < children; i++) {
            await this.page.getByLabel('Add Child').click();
        }
    }

    /**
     * Clicks Search button
     */
    async search(): Promise<void> {
        await this.page.getByRole('button', { name: 'Search' }).click();
    }
}