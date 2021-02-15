const palindrome = str => {
	return str.split('').reverse().join('')
}

const average = arr => {
	return arr.length === 0 ? 0 : arr.reduce((a, i) => a + i, 0) / arr.length
}

module.exports = { palindrome, average }
