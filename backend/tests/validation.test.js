/**
 * =============================================================================
 * VALIDATION MIDDLEWARE TESTS
 * =============================================================================
 * Tests for input validation middleware.
 * Run: npm test
 * =============================================================================
 */

const { validationRules } = require('../middleware/validateInput');

describe('Input Validation Rules', () => {

    describe('addMoney Validation', () => {
        test('should pass with valid data', () => {
            const body = { amount: 500, transactionId: 'STB999888777' };
            const errors = validationRules.addMoney(body);
            expect(errors).toHaveLength(0);
        });

        test('should fail with missing amount', () => {
            const body = { transactionId: 'STB999888777' };
            const errors = validationRules.addMoney(body);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0]).toContain('Amount');
        });

        test('should fail with negative amount', () => {
            const body = { amount: -100, transactionId: 'STB999888777' };
            const errors = validationRules.addMoney(body);
            expect(errors.length).toBeGreaterThan(0);
        });

        test('should fail with invalid UTR length', () => {
            const body = { amount: 500, transactionId: 'SHORT' };
            const errors = validationRules.addMoney(body);
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    describe('submitFeedback Validation', () => {
        test('should pass with valid data', () => {
            const body = { orderId: '123456', rating: 4, comment: 'Great food!' };
            const errors = validationRules.submitFeedback(body);
            expect(errors).toHaveLength(0);
        });

        test('should fail with missing orderId', () => {
            const body = { rating: 4 };
            const errors = validationRules.submitFeedback(body);
            expect(errors.length).toBeGreaterThan(0);
        });

        test('should fail with rating out of range', () => {
            const body = { orderId: '123', rating: 10 };
            const errors = validationRules.submitFeedback(body);
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    describe('updateProfile Validation', () => {
        test('should pass with valid data', () => {
            const body = { name: 'John Doe', email: 'john@example.com', phone: '9876543210' };
            const errors = validationRules.updateProfile(body);
            expect(errors).toHaveLength(0);
        });

        test('should fail with invalid email', () => {
            const body = { name: 'John', email: 'invalid-email', phone: '9876543210' };
            const errors = validationRules.updateProfile(body);
            expect(errors.length).toBeGreaterThan(0);
        });

        test('should fail with invalid phone', () => {
            const body = { name: 'John', email: 'john@example.com', phone: '123' };
            const errors = validationRules.updateProfile(body);
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    describe('toggleMealSkip Validation', () => {
        test('should pass with valid data', () => {
            const body = { date: '2026-02-07', mealType: 'lunch' };
            const errors = validationRules.toggleMealSkip(body);
            expect(errors).toHaveLength(0);
        });

        test('should fail with invalid date format', () => {
            const body = { date: '07-02-2026', mealType: 'lunch' };
            const errors = validationRules.toggleMealSkip(body);
            expect(errors.length).toBeGreaterThan(0);
        });

        test('should fail with invalid meal type', () => {
            const body = { date: '2026-02-07', mealType: 'breakfast' };
            const errors = validationRules.toggleMealSkip(body);
            expect(errors.length).toBeGreaterThan(0);
        });
    });
});
