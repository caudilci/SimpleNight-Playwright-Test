import { expect, type Locator, type Page } from '@playwright/test';
import { GuestScoreFilter } from '../../../types/types';

export class PlaywrightSearchHotelsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Opens views menu which is set to 'Grid' by default and selects 'Map' option
     */
    async selectMapView(): Promise<void> {
        await this.page.getByRole('button', { name: 'Grid' }).click();
        await this.page.getByText('Map').click();
    }

    /**
     * Clicks Reset button within Price Range filter section
     */
    async resetPriceRangeFilter(): Promise<void> {
        const priceSection = this.page.locator('//div[//div/div[text()="Price Range"]]');
        await priceSection.getByTestId('search-results-filters-price-reset-button').click();
    }

    /**
     * Moves left slider in Price Range filter until it matches or is very close to the target value
     * @remarks Code duplicated in the middle between this and the setMaxPrice function could be refactored
     * @param value target value for min price range filter
     */
    async setMinPrice(value: number): Promise<void> {
        const priceSection = this.page.locator('//div[//div/div[text()="Price Range"]]');
        const slider = priceSection.getByRole('slider').nth(0);
        let currentValue = await slider.getAttribute('aria-valuenow')
        let minValue = await slider.getAttribute('aria-valuemin')
        if (slider) {
            const boundingBox = await slider.boundingBox();
            if (boundingBox) {
                if (Number(currentValue) < value) {
                    while (Number(currentValue) < value) {
                        const startCoords = { x: boundingBox.x + boundingBox.width / 2, y: boundingBox.y + boundingBox.height / 2 }
                        await this.page.mouse.move(startCoords.x, startCoords.y);
                        await this.page.mouse.down();
                        await this.page.mouse.move(startCoords.x + 5, startCoords.y);
                        await this.page.mouse.up();
                        currentValue = await slider.getAttribute('aria-valuenow');
                    }
                }
                else {
                    while (Number(currentValue) > value && Number(currentValue) != Number(minValue)) {
                        const startCoords = { x: boundingBox.x + boundingBox.width / 2, y: boundingBox.y + boundingBox.height / 2 }
                        await this.page.mouse.move(startCoords.x, startCoords.y);
                        await this.page.mouse.down();
                        await this.page.mouse.move(startCoords.x - 5, startCoords.y);
                        await this.page.mouse.up();
                        currentValue = await slider.getAttribute('aria-valuenow');
                    }
                }

            }

        }
    }

    /**
     * Moves right slider in Price Range filter until it matches or is very close to the target value
     * @remarks Code duplicated in the middle between this and the setMinPrice function could be refactored
     * @param value target value for max price range filter
     */
    async setMaxPrice(value: number) {
        const priceSection = this.page.locator('//div[//div/div[text()="Price Range"]]');
        const slider = priceSection.getByRole('slider').nth(1);
        let currentValue = await slider.getAttribute('aria-valuenow')
        let maxValue = await slider.getAttribute('aria-valuemax')
        if (slider) {
            const boundingBox = await slider.boundingBox();
            if (boundingBox) {
                if (Number(currentValue) < value) {
                    while (Number(currentValue) > value) {
                        const startCoords = { x: boundingBox.x + boundingBox.width / 2, y: boundingBox.y + boundingBox.height / 2 }
                        await this.page.mouse.move(startCoords.x, startCoords.y);
                        await this.page.mouse.down();
                        await this.page.mouse.move(startCoords.x - 5, startCoords.y);
                        await this.page.mouse.up();
                        currentValue = await slider.getAttribute('aria-valuenow');
                    }
                }
                else {
                    while (Number(currentValue) < value && Number(currentValue) != Number(maxValue)) {
                        const startCoords = { x: boundingBox.x + boundingBox.width / 2, y: boundingBox.y + boundingBox.height / 2 }
                        await this.page.mouse.move(startCoords.x, startCoords.y);
                        await this.page.mouse.down();
                        await this.page.mouse.move(startCoords.x + 5, startCoords.y);
                        await this.page.mouse.up();
                        currentValue = await slider.getAttribute('aria-valuenow');
                    }
                }
            }
        }
    }

    /**
     * Clicks Reset button in Guest Score filter section
     */
    async resetGuestScoreFilter(): Promise<void> {
        const guestScoreSection = this.page.locator('//div[//div/div[text()="Guest Score"]]');
        await guestScoreSection.getByRole('button', { name: 'Reset', exact: true }).nth(1).click();
    }

    /**
     * Checks all options in Guest Score filter section that correspond to provided list entries
     * @param filters list of GuestScoreFilter strings corresponding to checklist entries in filter
     */
    async setGuestScoreFilter(filters: [GuestScoreFilter]): Promise<void> {
        for (const filter of filters) {
            const checkbox = this.page.getByRole('checkbox', { name: filter });
            await checkbox.scrollIntoViewIfNeeded();
            await checkbox.check();
        }
    }

    /**
     * Zooms map a max of 20 times and clicks map pin corresponding to hotel name
     * @remarks The count is just to prevent an infinite loop. There are probably more elegant solutions
     *          for navigating the map effectively.
     * @param hotelName Hotel name to match map pin to
     * @param hover whether to hover on the map center while scrolling or first map pin
     */
    async selectHotelOnMap(hotelName: string, hover: 'map' | 'pin') {
        const map = this.page.locator('.gm-style > div > div:nth-child(2)');
        if (hover === 'map') {
            const boundingBox = await map.boundingBox();
            let width = boundingBox?.width;
            width = width ? width : 0;
            let height = boundingBox?.height;
            height = height ? height : 0;
            await map.hover({ position: { x: width / 2, y: height / 2 } });
        }
        else {
            await map.getByRole('button').nth(0).hover();
        }
        let hotels = await map.getByRole('button', { name: hotelName }).all();
        let count = 0
        while (hotels.length == 0 && count < 20) {
            await this.page.mouse.wheel(0, -10);
            hotels = await map.getByRole('button', { name: hotelName }).all();
        }
        await map.getByRole('button', { name: hotelName }).click();
    }

    /**
     * Expects guest score on hotel card to be higher than provided minScore
     * @param minScore minimum score the hotel can have
     */
    async verifyMapHotelCardGuestScore(minScore: number) {
        const score = await this.page.locator('//article/div[2]/div/div[2]/div[1]').textContent();
        expect(Number(score)).toBeGreaterThan(minScore);
    }

    /**
     * Expects price on hotel card to be between min and max inclusively
     * @remarks This test currently only works for USD and other currencies where there is only one
     *          character to denote the currency type. A more sophisticated solution would be required
     *          for other currencies.
     * @param min min possible price
     * @param max max possible price
     */
    async verifyMapHotelCardPrice(min: number, max: number) {
        const price = await this.page.locator('//article/div[2]/div/div[4]/div[1]/span[2]').textContent();
        let priceNum = price ? Number(price?.substring(1)) : -1;
        expect(priceNum).toBeGreaterThanOrEqual(min);
        expect(priceNum).toBeLessThanOrEqual(max);
    }


}