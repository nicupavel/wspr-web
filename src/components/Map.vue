<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useWSPRStore } from '@/stores/wspr'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { useMaidenheadLeaflet } from '@/services/maidenhead-leaflet'
import useGeoJsonLeaflet from '@/services/geojson-leaflet'
import useGeoJsonData from '@/services/geojson-data'
import { compileScript } from 'vue/compiler-sfc'

const wsprStore = useWSPRStore()
const maidenheadLeaflet = useMaidenheadLeaflet()
const geoJsonLayer = useGeoJsonLeaflet()
const geoJsonData = useGeoJsonData()

const { currentTracking, data, uiOptions } = storeToRefs(wsprStore)

let map
let geoLayer
let maidenLayer

function buildMap() {
  map = L.map('map').setView([40, -121], 3)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map)

  maidenLayer = L.maidenhead({
    color: 'rgba(255, 0, 0, 0.4)'
  }).addTo(map)

  if (!uiOptions.value?.showGrid) {
    map.removeLayer(maidenLayer)
  }

  geoLayer = geoJsonLayer.createLayer()
  geoLayer.addTo(map)
}

watch(
  () => data.value,
  (data) => {
    if (!data || !data.length) return
    const geoData = geoJsonData.fromData(data)
    geoLayer.addData(geoData)

    const lastCoord = geoData.features[0].geometry.coordinates
    map.setView(new L.LatLng(lastCoord[1], lastCoord[0]), 13)
  },
  { deep: true }
)

watch(
  () => uiOptions.value,
  (options) => {
    if (options.showGrid) {
      map.addLayer(maidenLayer)
    } else {
      map.removeLayer(maidenLayer)
    }

    let geoData

    if (options.dateFilter == null) {
      // Date Filter reset show entire data available
      geoData = data.value
    } else if (options.dateFilter[1]) {
      // Both Dates filled in filter show filtered data
      geoData = data.value.filter(
        (e) =>
          new Date(e.date) >= options.dateFilter[0] && new Date(e.date) <= options.dateFilter[1]
      )
    }

    // Show data on geoJson layer
    try {
      geoLayer.remove()
      geoLayer = geoJsonLayer.createLayer(geoJsonData.fromData(geoData))
      geoLayer.addTo(map)
    } catch (e) {
      //console.error(e)
    }
  },
  { deep: true }
)

onMounted(() => {
  buildMap()
})
</script>
<template>
  <div>
    <div id="map" style="width: 100%; height: 60vh"></div>
  </div>
</template>
<style scoped>
@import 'leaflet/dist/leaflet.css';
</style>
@/services/geojson-data
