import { expect, type Locator, type Page } from '@playwright/test';
import { GuestScoreFilter } from '../../../types/types';

export class PlaywrightSearchHotelsPage {
    readonly page: Page;
    readonly baseURL: string;

    constructor(page: Page, baseURL: string) {
        this.page = page;
        this.baseURL = baseURL;
    }

    async selectMapView(): Promise<void> {
        await this.page.getByRole('button', { name: 'Grid' }).click();
        await this.page.getByText('Map').click();
    }

    async resetPriceRangeFilter(): Promise<void> {
        const priceSection = this.page.locator('//div[//div/div[text()="Price Range"]]');
        await priceSection.getByTestId('search-results-filters-price-reset-button').click();
    }

    // these really need aria labels
    async setMinPrice(value: number): Promise<void> {
        const priceSection = this.page.locator('//div[//div/div[text()="Price Range"]]');
        const slider = priceSection.getByRole('slider').nth(0);
        let currentValue = await slider.getAttribute('aria-valuenow')
        let minValue = await slider.getAttribute('aria-valuemin')
        if (slider) {
            let boundingBox = await slider.boundingBox();
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

    async setMaxPrice(value: number) {
        const priceSection = this.page.locator('//div[//div/div[text()="Price Range"]]');
        const slider = priceSection.getByRole('slider').nth(1);
        let currentValue = await slider.getAttribute('aria-valuenow')
        let maxValue = await slider.getAttribute('aria-valuemax')
        if (slider) {
            let boundingBox = await slider.boundingBox();
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

    async resetGuestScoreFilter(): Promise<void> {
        const guestScoreSection = this.page.locator('//div[//div/div[text()="Guest Score"]]');
        await guestScoreSection.getByRole('button', { name: 'Reset', exact: true }).nth(1).click();
    }

    async setGuestScoreFilter(filters: [GuestScoreFilter]): Promise<void> {
        for (const filter of filters) {
            const checkbox = this.page.getByRole('checkbox', { name: filter });
            await checkbox.scrollIntoViewIfNeeded();
            await checkbox.check();
        }
    }

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
        while (hotels.length == 0) {
            await this.page.mouse.wheel(0, -10);
            hotels = await map.getByRole('button', { name: hotelName }).all();
        }
        await map.getByRole('button', { name: hotelName }).click();
    }

    async verifyMapHotelCardGuestScore(minScore: number) {
        const score = await this.page.locator('//article/div[2]/div/div[2]/div[1]').textContent();
        expect(Number(score)).toBeGreaterThan(minScore);
    }

    async verifyMapHotelCardPrice(min: number, max: number) {
        const price = await this.page.locator('//article/div[2]/div/div[4]/div[1]/span[2]').textContent();
        let priceNum = price ? Number(price?.substring(1)) : -1;
        expect(priceNum).toBeGreaterThanOrEqual(min);
        expect(priceNum).toBeLessThanOrEqual(max);
    }


}