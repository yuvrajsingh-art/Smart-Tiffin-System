/**
 * =============================================================================
 * CONSTANTS CONFIG TESTS
 * =============================================================================
 * Tests to verify config constants exist and have valid values.
 * Run: npm test
 * =============================================================================
 */

const {
    MEAL,
    CALORIES,
    IMAGES,
    MAP,
    ORDER_STATUS,
    WALLET,
    PAGINATION,
    FEEDBACK,
    LOYALTY
} = require('../config/constants');

describe('Config Constants', () => {

    describe('MEAL Config', () => {
        test('should have valid cutoff times', () => {
            expect(MEAL.CUTOFF_LUNCH).toBe(10);
            expect(MEAL.CUTOFF_DINNER).toBe(16);
        });

        test('should have meal types', () => {
            expect(MEAL.TYPES.LUNCH).toBe('lunch');
            expect(MEAL.TYPES.DINNER).toBe('dinner');
        });

        test('should have default times', () => {
            expect(MEAL.DEFAULT_LUNCH_TIME).toBeDefined();
            expect(MEAL.DEFAULT_DINNER_TIME).toBeDefined();
        });
    });

    describe('CALORIES Config', () => {
        test('should have positive calorie values', () => {
            expect(CALORIES.BREAD).toBeGreaterThan(0);
            expect(CALORIES.RICE).toBeGreaterThan(0);
            expect(CALORIES.DAL).toBeGreaterThan(0);
            expect(CALORIES.DEFAULT).toBeGreaterThan(0);
        });
    });

    describe('IMAGES Config', () => {
        test('should have menu images', () => {
            expect(IMAGES.MENU.LUNCH_VEG).toMatch(/^https?:\/\//);
            expect(IMAGES.MENU.DINNER_VEG).toMatch(/^https?:\/\//);
            expect(IMAGES.MENU.FALLBACK).toMatch(/^https?:\/\//);
        });

        test('should have delivery images', () => {
            expect(IMAGES.DELIVERY.PARTNER).toMatch(/^https?:\/\//);
            expect(IMAGES.DELIVERY.RESTAURANT).toMatch(/^https?:\/\//);
        });
    });

    describe('MAP Config', () => {
        test('should have valid default center', () => {
            expect(MAP.DEFAULT_CENTER.lat).toBeDefined();
            expect(MAP.DEFAULT_CENTER.lng).toBeDefined();
            expect(typeof MAP.DEFAULT_CENTER.lat).toBe('number');
            expect(typeof MAP.DEFAULT_CENTER.lng).toBe('number');
        });
    });

    describe('ORDER_STATUS Config', () => {
        test('should have status flow array', () => {
            expect(Array.isArray(ORDER_STATUS.FLOW)).toBe(true);
            expect(ORDER_STATUS.FLOW.length).toBeGreaterThan(0);
        });

        test('should have valid statuses', () => {
            expect(ORDER_STATUS.VALID).toContain('confirmed');
            expect(ORDER_STATUS.VALID).toContain('delivered');
        });

        test('should have ETA values', () => {
            expect(ORDER_STATUS.ETA.confirmed).toBeGreaterThan(0);
            expect(ORDER_STATUS.ETA.cooking).toBeGreaterThan(0);
        });
    });

    describe('WALLET Config', () => {
        test('should have valid topup limits', () => {
            expect(WALLET.MIN_TOPUP).toBeGreaterThan(0);
            expect(WALLET.MAX_TOPUP).toBeGreaterThan(WALLET.MIN_TOPUP);
        });

        test('should have UTR length', () => {
            expect(WALLET.UTR_LENGTH).toBe(12);
        });
    });

    describe('FEEDBACK Config', () => {
        test('should have valid rating range', () => {
            expect(FEEDBACK.MIN_RATING).toBe(1);
            expect(FEEDBACK.MAX_RATING).toBe(5);
        });

        test('should have tags array', () => {
            expect(Array.isArray(FEEDBACK.TAGS)).toBe(true);
            expect(FEEDBACK.TAGS.length).toBeGreaterThan(0);
        });
    });

    describe('LOYALTY Config', () => {
        test('should have bronze, silver, gold levels', () => {
            expect(LOYALTY.BRONZE).toBeDefined();
            expect(LOYALTY.SILVER).toBeDefined();
            expect(LOYALTY.GOLD).toBeDefined();
        });
    });
});
