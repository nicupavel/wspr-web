export default function useWSPRLiveService() {
  /**
   * Builds the url to query wspr.live
   * @param {String} callsign
   * @param {Integer} minutesInterval
   * @param {Integer} limit
   * @returns {String}
   */
  function buildUrl(callsign, minutesInterval, limit) {
    if (!callsign) return null
    minutesInterval = minutesInterval ?? 0
    limit = limit ?? 0

    let query = `SELECT id, time, rx_sign, tx_sign, tx_lat, tx_lon, tx_loc, distance, azimuth, frequency, power FROM wspr.rx 
      WHERE tx_sign='${callsign}'
        AND (band = 10 OR band = 14 OR band = 18 OR band = 21) 
        AND match(tx_sign,'^[Q01]') = 0
    `

    if (minutesInterval) query += ` AND time >= subtractMinutes(now(), ${minutesInterval})`
    query += ' ORDER BY time DESC'
    if (limit) query += ` LIMIT ${limit}`

    const url = `https://db1.wspr.live/?query=${query} FORMAT JSONCompact`
    console.log(url)
    return url
  }

  /**
   * Fetches data from wspr.live API service
   * @param {String} callsign
   * @param {Integer} minutesInterval
   * @param {Integer} limit
   * @returns {Promise}
   */
  async function download(callsign, minutesInterval, limit) {
    const url = buildUrl(callsign, minutesInterval, limit)
    if (!url) {
      return null
    }

    return await fetch(url)
  }

  /**
   * Parses wspr.live API data to a map[callsign][datetime] = { tx_loc, tx_loc_extra }
   * @param { Object } wsprLiveResponse: { meta: [], data: [], rows: 0 }
   * @returns { Object } parsed object
   */
  function parse(wsprLiveResponse) {
    const kv = {}
    const meta = mapWSPRLiveMetaKeys(wsprLiveResponse.meta)
    const data = wsprLiveResponse.data

    for (const entry of data) {
      const callsign = entry[meta.tx_sign]
      const datetime = entry[meta.time]

      if (!(callsign in kv)) {
        kv[callsign] = {}
      }

      if (!(datetime in kv[callsign])) {
        // We keep only 1 report for that datetime. As API returns multiple entries for same datetime for different receiving stations
        kv[callsign][datetime] = {
          tx_loc: entry[meta.tx_loc],
          tx_loc_extra: entry[meta.power]
        }
      }
    }

    return kv
  }

  function aggregate(kvData, callsign) {
    const DBM_VALUES = [0, 3, 7, 10, 13, 17, 20, 23, 27, 30, 33, 37, 40, 43, 47, 50, 53, 57, 60]

    const PAIR_DIFF = 2 // time difference between 2 transmissions to be considered paired

    const aggregatedData = {}

    if (!(callsign in kvData)) return null

    let prevTimeKey = null
    let prevExtraLocation = null
    let isPaired = false

    for (const timeKey in kvData[callsign]) {
      const entry = kvData[callsign][timeKey]

      if (prevTimeKey == null) {
        prevTimeKey = timeKey
      } else if (timeKey != prevTimeKey) {
        const d1 = new Date(prevTimeKey)
        const d2 = new Date(timeKey)

        // Data is ordered desc by time check for a 2min diff between reports
        if ((d1 - d2) / (60 * 1000) == PAIR_DIFF) {
          isPaired = true
        } else {
          // Save this marker as a low accuracy maidenhead
          aggregatedData[prevTimeKey] = {
            tx_loc: entry.tx_loc,
            precise: false
          }
          prevTimeKey = timeKey
          continue
        }
      }

      if (prevExtraLocation == null) {
        // First value for extra location
        prevExtraLocation = entry.tx_loc_extra
      } else if (entry.tx_loc_extra != prevExtraLocation) {
        // We got the second value concatenate maidenhead location + 2 extra digits
        let maiden1 = DBM_VALUES.indexOf(prevExtraLocation)
        let maiden2 = DBM_VALUES.indexOf(entry.tx_loc_extra)

        if (maiden1 > -1 && maiden2 > -1 && isPaired) {
          //console.log(`Adding location ${maiden2} ${maiden1}`)
          aggregatedData[timeKey] = {
            tx_loc: entry.tx_loc + maiden2 + maiden1, // As report is ordered desc by time we first find the second digit
            precise: true
          }
          // Reset to find another pair
          isPaired = false
          prevTimeKey = null
          prevExtraLocation = null
        }
      }
    }

    return aggregatedData
  }

  function mapWSPRLiveMetaKeys(wsprLiveMeta) {
    const meta = {}
    for (let i = 0; i < wsprLiveMeta.length; i++) {
      const entry = wsprLiveMeta[i]
      meta[entry.name] = i
      meta[i] = entry.name
    }

    return meta
  }

  //----------------------------------------------------------------------------------------------------------------
  //
  //
  return {
    buildUrl,
    download,
    parse,
    aggregate
  }
}
