/**
 * Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
 * Permission to use, copy, modify, and redistribute this software and its
 * documentation for personal, non-commercial use is hereby granted provided that
 * this copyright notice and appropriate documentation appears in all copies.
 */

const {floor, sin, PI} = Math

/**
 * Computes the (integral) Julian day number of day dd/mm/yyyy, i.e.,
 * The number of days between 1/1/4713 BC (Julian calendar) and dd/mm/yyyy.
 * Formula from http://www.tondering.dk/claus/calendar.html
 *
 * @param {Integer} dd
 * @param {Integer} mm
 * @param {Integer} yy
 *
 * return {Integer}
 */
const computeJulianDayFromDate = (dd, mm, yy) => {
  const a = floor((14 - mm) / 12)
  const y = yy + 4800 - a
  const m = mm + 12 * a - 3

  let jd =
    dd +
    floor((153 * m + 2) / 5) +
    365 * y +
    floor(y / 4) -
    floor(y / 100) +
    floor(y / 400) -
    32045

  if (jd < 2299161) {
    jd = dd + floor((153 * m + 2) / 5) + 365 * y + floor(y / 4) - 32083
  }

  return jd
}

/**
 * Convert a Julian day number to day/month/year.
 *
 * @param {Integer} jd
 *
 * return {Date}
 */
const computeDateFromJulianDay = (jd) => {
  let a, b, c

  if (jd > 2299160) {
    // After 5/10/1582, Gregorian calendar
    a = jd + 32044
    b = floor((4 * a + 3) / 146097)
    c = a - floor((b * 146097) / 4)
  } else {
    // Julius calendar
    b = 0
    c = jd + 32082
  }

  const d = floor((4 * c + 3) / 1461)
  const e = c - floor((1461 * d) / 4)
  const m = floor((5 * e + 2) / 153)
  const day = e - floor((153 * m + 2) / 5) + 1
  const month = m + 3 - 12 * floor(m / 10) - 1
  const year = b * 100 + d - 4800 + floor(m / 10)

  return {
    day,
    month,
    year
  }
}

/**
 * Compute the time of the k-th new moon after the new moon of 1/1/1900 13:52 UCT
 * (measured as the number of days since 1/1/4713 BC noon UCT, e.g., 2451545.125 is 1/1/2000 15:00 UTC).
 * Returns a floating number, e.g., 2415079.9758617813 for k=2 or 2414961.935157746 for k=-2
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 *
 * @param {Integer} k, the k-th new moon after the new moon of 1/1/1900 13:52 UCT
 *
 * return {Integer}
 */
const computeNewMoon = (k) => {
  const t = k / 1236.85 // Time in Julian centuries from 1900 January 0.5
  const t2 = t * t
  const t3 = t2 * t
  const dr = Math.PI / 180

  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * t2 - 0.000000155 * t3
  jd1 = jd1 + 0.00033 * sin((166.56 + 132.87 * t - 0.009173 * t2) * dr) // Mean new moon

  const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3 // Sun's mean anomaly
  const mpr = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3 // Moon's mean anomaly
  const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3 // Moon's argument of latitude

  let c1 = (0.1734 - 0.000393 * t) * sin(m * dr) + 0.0021 * sin(2 * dr * m)
  c1 = c1 - 0.4068 * sin(mpr * dr) + 0.0161 * sin(dr * 2 * mpr)
  c1 = c1 - 0.0004 * sin(dr * 3 * mpr)
  c1 = c1 + 0.0104 * sin(dr * 2 * f) - 0.0051 * sin(dr * (m + mpr))
  c1 = c1 - 0.0074 * sin(dr * (m - mpr)) + 0.0004 * sin(dr * (2 * f + m))
  c1 = c1 - 0.0004 * sin(dr * (2 * f - m)) - 0.0006 * sin(dr * (2 * f + mpr))
  c1 = c1 + 0.001 * sin(dr * (2 * f - mpr)) + 0.0005 * sin(dr * (2 * mpr + m))

  const calculateDeltaT = (t) => {
    let deltaT

    const t2 = t * t
    const t3 = t2 * t

    if (t < -11) {
      deltaT =
        0.001 +
        0.000839 * t +
        0.0002261 * t2 -
        0.00000845 * t3 -
        0.000000081 * t * t3
    } else {
      deltaT = -0.000278 + 0.000265 * t + 0.000262 * t2
    }

    return deltaT
  }

  const jd = jd1 + c1 - calculateDeltaT(t)

  return jd
}

/**
 * Compute the longitude of the sun at any time.
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 *
 * @param {Float} jdn, the number of days since 1/1/4713 BC noon
 *
 * return {Float}
 */
const computeSunLongitude = (jdn) => {
  const t = (jdn - 2451545.0) / 36525 // Time in Julian centuries from 2000-01-01 12:00:00 GMT
  const t2 = t * t
  const dr = PI / 180 // degree to radian
  const m = 357.5291 + 35999.0503 * t - 0.0001559 * t2 - 0.00000048 * t * t2 // mean anomaly, degree
  const l0 = 280.46645 + 36000.76983 * t + 0.0003032 * t2 // mean longitude, degree

  let dl = (1.9146 - 0.004817 * t - 0.000014 * t2) * Math.sin(dr * m)
  dl =
    dl +
    (0.019993 - 0.000101 * t) * Math.sin(dr * 2 * m) +
    0.00029 * Math.sin(dr * 3 * m)

  let l = l0 + dl // true longitude, degree
  l = l * dr
  l = l - PI * 2 * floor(l / (PI * 2)) // Normalize to (0, 2*PI)

  return l
}

/**
 * Compute sun position at midnight of the day with the given Julian day number.
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
 * The function returns a number between 0 and 11.
 * From the day after March equinox and the 1st major term after March equinox, 0 is returned.
 * After that, return 1, 2, 3 ...
 *
 * @param {Integer} dayNumber
 * @param {Integer} timeZone
 *
 * return {Integer}
 */
const getSunLongitude = (dayNumber, timeZone) => {
  return floor((computeSunLongitude(dayNumber - 0.5 - timeZone / 24) / PI) * 6)
}

/**
 * Compute the day of the k-th new moon in the given time zone.
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00
 *
 * @param {Integer} k, the k-th new moon after the new moon of 1/1/1900 13:52 UCT
 *
 * @return {Integer}
 */
const getNewMoonDay = (k, timeZone) => {
  return floor(computeNewMoon(k) + 0.5 + timeZone / 24)
}

/**
 * Find the day that starts the luner month 11 of the given year for the given time zone
 *
 * @param {Integer} yy
 * @param {Integer} timeZone
 *
 * return {Integer}
 */
const getLunarMonth11 = (yy, timeZone) => {
  const off = computeJulianDayFromDate(31, 12, yy) - 2415021
  const k = floor(off / 29.530588853)

  let nm = getNewMoonDay(k, timeZone)

  const sunLong = getSunLongitude(nm, timeZone) // sun longitude at local midnight

  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone)
  }
  return nm
}

/**
 * Find the index of the leap month after the month starting on the day a11.
 *
 * @param {Integer} a11
 * @param {Integer} timeZone
 *
 * return {Integer}
 */
const getLeapMonthOffset = (a11, timeZone) => {
  const k = floor((a11 - 2415021.076998695) / 29.530588853 + 0.5)

  let last = 0
  let i = 1 // We start with the month following lunar month 11
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone)

  do {
    last = arc
    i++
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone)
  } while (arc != last && i < 14)

  return i - 1
}

/**
 * Compute date dd/mm/yyyy to the corresponding lunar date
 *
 * @param {Integer} dd
 * @param {Integer} mm
 * @param {Integer} yy
 * @param {Integer} timeZone
 *
 * return {}
 */
export const computeDateToLunarDate = (dd, mm, yy, timeZone) => {
  const dayNumber = computeJulianDayFromDate(dd, mm, yy)
  const k = floor((dayNumber - 2415021.076998695) / 29.530588853)

  let monthStart = getNewMoonDay(k + 1, timeZone)

  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone)
  }

  let a11 = getLunarMonth11(yy, timeZone)
  let b11 = a11
  let lunarYear

  if (a11 >= monthStart) {
    lunarYear = yy
    a11 = getLunarMonth11(yy - 1, timeZone)
  } else {
    lunarYear = yy + 1
    b11 = getLunarMonth11(yy + 1, timeZone)
  }

  const lunarDay = dayNumber - monthStart + 1
  const diff = floor((monthStart - a11) / 29)

  let lunarLeap = false
  let lunarMonth = diff + 11
  let leapMonthDiff

  if (b11 - a11 > 365) {
    leapMonthDiff = getLeapMonthOffset(a11, timeZone)
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10
      if (diff == leapMonthDiff) {
        lunarLeap = true
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12
  }

  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1
  }

  return {
    lunarDay,
    lunarMonth,
    lunarYear,
    lunarLeap
  }
}

/**
 * Compute a lunar date to the corresponding date
 *
 * @param {Integer} lunarDay
 * @param {Integer} lunarMonth
 * @param {Integer} lunarYear
 * @param {Boolean} lunarLeap
 * @param {Integer} timeZone
 */
export const computeDateFromLunarDate = (
  lunarDay,
  lunarMonth,
  lunarYear,
  lunarLeap,
  timeZone
) => {
  let a11
  let b11

  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone)
    b11 = getLunarMonth11(lunarYear, timeZone)
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone)
    b11 = getLunarMonth11(lunarYear + 1, timeZone)
  }
  const k = floor(0.5 + (a11 - 2415021.076998695) / 29.530588853)

  let off = lunarMonth - 11

  if (off < 0) {
    off += 12
  }

  let leapOff
  let leapMonth

  if (b11 - a11 > 365) {
    leapOff = getLeapMonthOffset(a11, timeZone)
    leapMonth = leapOff - 2

    if (leapMonth < 0) {
      leapMonth += 12
    }

    if (lunarLeap && lunarMonth != leapMonth) {
      return new Array(0, 0, 0)
    } else if (lunarLeap != 0 || off >= leapOff) {
      off += 1
    }
  }

  const monthStart = getNewMoonDay(k + off, timeZone)

  return computeDateFromJulianDay(monthStart + lunarDay - 1)
}
