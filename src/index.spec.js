import {computeDateFromLunarDate, computeDateToLunarDate} from './index'

describe('computeDateFromLunarDate', () => {
  test('should return the right date', () => {
    const date = computeDateFromLunarDate(6, 6, 2018, false, 7)

    expect(date).toEqual({day: 18, month: 6, year: 2018})
  })
})

describe('computeDateToLunarDate', () => {
  test('should return the right date', () => {
    const lunarDate = computeDateToLunarDate(18, 7, 2018, 7)

    expect(lunarDate).toEqual({
      lunarDay: 6,
      lunarMonth: 6,
      lunarYear: 2018,
      lunarLeap: false
    })
  })
})
