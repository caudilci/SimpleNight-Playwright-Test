import { GuestScoreFilter, MinGuestScore } from "../../src/types/types"

type HotelSearchTest = {
    testInfoSlug: string,
    baseURL: string,
    destinationSearchValue: string,
    destinationValue: string,
    fromDate: { day: number, month: number, year: number },
    toDate: { day: number, month: number, year: number },
    guests: {adults: number, children: number},
    price: {min: number, max: number},
    guestScoreFilter: [GuestScoreFilter],
    minGuestScore: MinGuestScore,
    hotelName: string,
    mapNavigationType: 'pin' | 'map'
}

const environment = process.env.TEST_ENVIRONMENT ?? 'app';

export const testData: [HotelSearchTest] = [
    {
        testInfoSlug: 'prod-miami-may-good-hyde-suites',
        baseURL: `https://${environment}.simplenight.com/`,
        destinationSearchValue: 'Miami',
        destinationValue: 'Miami Miami, FL, USA',
        fromDate: { day: 20, month: 5, year: 2025 },
        toDate: { day: 22, month: 5, year: 2025 },
        guests: {adults: 1, children: 1},
        price: {min: 100, max: 1000},
        guestScoreFilter: [GuestScoreFilter.Good],
        minGuestScore: MinGuestScore.Good,
        hotelName: 'Hyde Suites Midtown Miami',
        mapNavigationType: 'pin'
    }
] 