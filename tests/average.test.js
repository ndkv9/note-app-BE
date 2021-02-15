const average = require('../utils/forTesting').average

describe('average', () => {
	test('of one value is the value itself', () => {
		const result = average([3])
		expect(result).toBe(3)
	})

	test('of many is calculted properly', () => {
		const result = average([5, 6, 7, 8, 9])
		expect(result).toBe(7)
	})

	test('of an empty array is zero', () => {
		expect(average([])).toBe(0)
	})
})
