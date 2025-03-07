import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../src/Pages/Home/home';
import { PlaywrightHomeHotelsPage } from '../src/Pages/Home/Hotels/hotels';
import { PlaywrightSearchHotelsPage } from '../src/Pages/Search/Hotels/hotels';
import { GuestScoreFilter } from '../src/types/types';

test('test', async ({ page }) => {
  const baseURL = 'https://app.simplenight.com/'
  const home = new PlaywrightHomePage(page, baseURL);
  const homeHotels = new PlaywrightHomeHotelsPage(page, baseURL);
  const searchHotels = new PlaywrightSearchHotelsPage(page, baseURL);

  await home.goto();
  await home.selectHotelsCategory();

  await homeHotels.populateLocationField('Miami');
  await homeHotels.selectLocation('Miami Miami, FL, USA');
  await homeHotels.selectDates({ day: 20, month: 5, year: 2025 }, { day: 22, month: 5, year: 2025 });
  await homeHotels.addGuests(0, 1);
  await homeHotels.search();

  await searchHotels.selectMapView();
  await page.waitForTimeout(5000);
  await searchHotels.resetPriceRangeFilter();
  await searchHotels.setMinPrice(100);
  await searchHotels.setMaxPrice(1000);
  await searchHotels.resetGuestScoreFilter();
  await searchHotels.setGuestScoreFilter([GuestScoreFilter.Good]);
  await searchHotels.selectHotelOnMap('Hyde Suites Midtown Miami', 'pin');
  await searchHotels.verifyMapHotelCardGuestScore(5);
  await searchHotels.verifyMapHotelCardPrice(100, 1000);
});
