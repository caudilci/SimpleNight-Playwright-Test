import { test } from '@playwright/test';
import { PlaywrightHomePage } from '../../src/Pages/Home/home';
import { PlaywrightHomeHotelsPage } from '../../src/Pages/Home/Hotels/hotels';
import { PlaywrightSearchHotelsPage } from '../../src/Pages/Search/Hotels/hotels';
import { testData } from './testData';

testData.forEach(data => {
  test(`HotelSearch ${data.testInfoSlug}`, async ({ page }) => {
    const baseURL = data.baseURL
    const home = new PlaywrightHomePage(page, baseURL);
    const homeHotels = new PlaywrightHomeHotelsPage(page);
    const searchHotels = new PlaywrightSearchHotelsPage(page);
  
    await home.goto();
    await home.selectHotelsCategory();
  
    await homeHotels.populateDestinationField(data.destinationSearchValue);
    await homeHotels.selectDestination(data.destinationValue);
    await homeHotels.selectDates(data.fromDate, data.toDate);
    await homeHotels.addGuests(data.guests.adults-1, data.guests.children);
    await homeHotels.search();
  
    await searchHotels.selectMapView();
    await page.waitForTimeout(5000); // Sometimes map pins and prices take a few seconds to load. Ideally this would be removed in the future
    await searchHotels.resetPriceRangeFilter();
    await searchHotels.setMinPrice(data.price.min);
    await searchHotels.setMaxPrice(data.price.max);
    await searchHotels.resetGuestScoreFilter();
    await searchHotels.setGuestScoreFilter(data.guestScoreFilter);
    await searchHotels.selectHotelOnMap(data.hotelName, data.mapNavigationType);
    await searchHotels.verifyMapHotelCardGuestScore(data.minGuestScore);
    await searchHotels.verifyMapHotelCardPrice(data.price.min, data.price.max);
  });
});
