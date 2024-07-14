/*
 *   Copyright (c) 2024 Nicu Pavel <npavel@linuxconsulting.ro>
 *   All rights reserved.
 */

// Functions that handle conversion from latitude/longitude to Maidenhead locator
// and the otherway around.

export default function useMaidenheadConverter() {
  const maidenheadRegex = /([A-Ra-r]{2}\d\d)(([A-Za-z]{2})(\d\d)?){0,2}/

  const isDigit = (char) => {
    return char >= 0 && char < 10
  }

  const toUpperCaseLetter = (num) => String.fromCharCode(('A'.charCodeAt(0) + num) >> 0)
  const toLowerCaseLetter = (num) => String.fromCharCode(('a'.charCodeAt(0) + num) >> 0)

  const toAsciiIndex = (char) => char.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)

  const fractionalDegrees = (index) =>
    10 ** (1 - (((index + 1) / 2) >> 0)) * 24 ** ((-index / 2) >> 0)

  const divmod = (x, y) => [Math.floor(x / y), x % y]

  function fromLatLon(lat, lon, precision) {
    precision = precision ?? 8
    if (!lat || !lon || precision < 4 || precision > 10 || precision % 2 == 1) {
      return null
    }

    // Main square 20 degrees by 10 degrees
    let coordLat = divmod(lat + 90, 10)
    let coordLon = divmod(lon + 180, 20)

    let maidenhead = toUpperCaseLetter(coordLon[0]) + toUpperCaseLetter(coordLat[0])

    lon = coordLon[1] / 2
    lat = coordLat[1]

    for (let i = 1; i < (precision / 2) >> 0; i++) {
      coordLon = divmod(lon, 1)
      coordLat = divmod(lat, 1)
      if ((i + 1) % 2) {
        maidenhead += toLowerCaseLetter(coordLon[0]) + toLowerCaseLetter(coordLat[0])
        lon = 10 * coordLon[1]
        lat = 10 * coordLat[1]
      } else {
        maidenhead += coordLon[0]
        maidenhead += coordLat[0]

        lon = 24 * coordLon[1]
        lat = 24 * coordLat[1]
      }
    }

    return maidenhead
  }

  function toLatLon(locstr) {
    if (!locstr || locstr.length % 2 == 1 || !locstr.match(maidenheadRegex)) {
      return []
    }

    let lon = -90,
      lat = -90
    const pairs = []

    for (let i = 0; i < locstr.length; i += 2) {
      let d1, d2
      if (isDigit(locstr[i]) && isDigit(locstr[i + 1])) {
        d1 = +locstr[i]
        d2 = +locstr[i + 1]
      } else {
        d1 = toAsciiIndex(locstr[i])
        d2 = toAsciiIndex(locstr[i + 1])
      }
      pairs.push([d1, d2])
    }

    for (let i = 0; i < pairs.length; i++) {
      lon += fractionalDegrees(i) * pairs[i][0]
      lat += fractionalDegrees(i) * pairs[i][1]
    }
    lon *= 2
    lon += fractionalDegrees(pairs.length - 1) / 2
    lat += fractionalDegrees(pairs.length - 1) / 2

    return [lat, lon]
  }

  //----------------------------------------------------------------------------------------------------------------
  //
  //
  return {
    fromLatLon,
    toLatLon
  }
}
