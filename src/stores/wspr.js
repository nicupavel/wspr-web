/*
 *   Copyright (c) 2024 Nicu Pavel <npavel@linuxconsulting.ro>
 *   All rights reserved.
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'

import useWSPRLiveService from '@/services/wsprlive'
import useMaidenheadConverter from '@/services/maidenhead'
import useGeoJson from '@/services/geojson'

export const useWSPRStore = defineStore('wspr', () => {
  const REFRESH_INTERVAL_MIN = 4
  const REFRESH_INTERVAL_MS = REFRESH_INTERVAL_MIN * 60 * 1000
  const INITIAL_DOWNLOAD_FROM_MINUTES = 40320 // 2 weeks
  const INITIAL_DOWNLOAD_ROWS_LIMIT = 0
  const MAX_DATA_LENGTH = 1000000

  const STATE = {
    IDLE: 0,
    DOWNLOADING: 1,
    REFRESHING: 2,
    ERROR: 3
  }

  const wsprService = useWSPRLiveService()
  const geoJson = useGeoJson()
  const maidenheadConvert = useMaidenheadConverter()

  const data = ref([]) // cummulative data array of objects
  const geoData = ref() // latest data only in geoJSON format

  const currentTracking = ref({
    interval: null,
    callsign: null,
    prevCallsign: null,
    rowsReceived: 0,
    state: STATE.IDLE,
    error: null
  })

  const uiOptions = ref({
    showGrid: false
  })

  async function download(callsign, minutesInterval, limit) {
    if (!callsign) return null

    try {
      currentTracking.value.error = null
      currentTracking.value.state = STATE.DOWNLOADING

      callsign = callsign.toUpperCase()

      const response = await wsprService.download(callsign, minutesInterval, limit)
      const wsprData = await response.json()

      currentTracking.value.state = STATE.REFRESHING

      if (wsprData?.rows) {
        const kv = wsprService.parse(wsprData)
        console.log(kv)
        const aggregatedData = wsprService.aggregate(kv, callsign)
        console.log(aggregatedData)
        currentTracking.value.rowsReceived = wsprData.rows
        return aggregatedData
      }
      currentTracking.value.rowsReceived = 0
    } catch (e) {
      currentTracking.value.state = STATE.ERROR
      currentTracking.value.error = e.toString()
      console.error(e)
    }

    return null
  }

  function storeData(aggregatedData) {
    //console.log(aggregatedData)
    if (!aggregatedData || !Object.keys(aggregatedData).length) return

    geoData.value = geoJson.createCollection()

    for (const key in aggregatedData) {
      const maidenhead = aggregatedData[key].tx_loc
      const precise = aggregatedData[key].precise
      const coords = maidenheadConvert.toLatLon(maidenhead)

      // cummulative data for datatable ui
      data.value.push({
        date: key,
        maidenhead: maidenhead,
        precise: precise,
        lat: coords[0],
        lon: coords[1]
      })

      if (data.value.length > MAX_DATA_LENGTH) {
        data.value.shift()
      }

      const point = geoJson.featurePoint(coords[0], coords[1], {
        popupContent: `${key}: ${maidenhead}`,
        precise: precise
      })
      geoJson.addToCollection(geoData.value, point)
    }
    //console.log(geoData.value)
  }

  async function track(callsign) {
    if (!callsign) return

    currentTracking.value.callsign = callsign

    if (currentTracking.value.prevCallsign != callsign) {
      data.value = []
      currentTracking.value.prevCallsign = callsign
      // Initial download (get last rows)
      const aggregatedData = await download(
        callsign,
        INITIAL_DOWNLOAD_FROM_MINUTES,
        INITIAL_DOWNLOAD_ROWS_LIMIT
      )
      storeData(aggregatedData)
    }

    // Refresh new data
    currentTracking.value.interval = setInterval(async () => {
      const aggregatedData = await download(callsign, REFRESH_INTERVAL_MIN)
      storeData(aggregatedData)
    }, REFRESH_INTERVAL_MS)
  }

  async function stopTracking() {
    clearInterval(currentTracking.value.interval)
    currentTracking.value.callsign = null
    currentTracking.value.state = STATE.IDLE
  }

  //----------------------------------------------------------------------------------------------------------------
  //
  //
  return {
    STATE,
    data,
    geoData,
    currentTracking,
    uiOptions,
    download,
    track,
    stopTracking
  }
})
