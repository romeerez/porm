const {quote} = require('pg-adapter')

module.exports = {
  quote,
  objects: jest.fn(() => ({then: () => {}})),
  arrays: jest.fn(() => ({then: () => {}})),
  value: jest.fn(() => ({then: () => {}})),
  exec: jest.fn(() => ({then: () => {}})),
}
