<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useWSPRStore } from '@/stores/wspr'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { useMaidenheadLeaflet } from '@/services/maidenhead-leaflet'

const wsprStore = useWSPRStore()
const maidenheadLeaflet = useMaidenheadLeaflet()

const { currentTracking, geoData } = storeToRefs(wsprStore)

let map
let geoLayer

function onEachFeature(feature, layer) {
  let popupContent = ''

  if (feature.properties && feature.properties.popupContent) {
    popupContent += feature.properties.popupContent
  }

  layer.bindPopup(popupContent)
}

function buildMap() {
  map = L.map('map').setView([40, -121], 3)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map)

  L.maidenhead({
    color: 'rgba(255, 0, 0, 0.4)'
  }).addTo(map)

  geoLayer = L.geoJSON(null, {
    style(feature) {
      return feature.properties && feature.properties.style
    },
    onEachFeature,
    pointToLayer(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 8,
        fillColor: '#000000',
        color: '#ffffff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      })
    }
  }).addTo(map)
}

watch(
  () => geoData.value,
  (data) => {
    if (!data) return

    geoLayer.addData(data)
    const lastCoord = data.features[0].geometry.coordinates
    map.setView(new L.LatLng(lastCoord[1], lastCoord[0]), 13)
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
