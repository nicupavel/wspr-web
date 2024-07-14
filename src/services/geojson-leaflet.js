import L from 'leaflet'
import { useLeafletIcons } from '@/plugins/leaflet-icons'

export default function useGeoJsonLeaflet() {
  function createLayer(data, options) {
    const defaultOptions = {
      iconSize: 12,
      iconsPlugin: useLeafletIcons()
    }

    options = { ...defaultOptions, ...options }

    return L.geoJSON(data, {
      style(feature) {
        return feature.properties && feature.properties.style
      },
      onEachFeature,
      pointToLayer(feature, latlng) {
        const markerColor = dateToColor(feature?.properties.date)
        const precision = feature?.properties?.precision ?? 4

        // Circle icon for 8 chars maidenhead precision
        let icon = options.iconsPlugin.circleIcon(options.iconSize, markerColor)

        if (precision <= 4) {
          icon = options.iconsPlugin.triangleIcon(options.iconSize, markerColor)
        } else if (precision < 8) {
          icon = options.iconsPlugin.rectangleIcon(options.iconSize, markerColor)
        }

        return L.marker(latlng, { icon: icon })
      }
    })
  }

  //----------------------------------------------------------------------------------------------------------------
  //
  //
  function onEachFeature(feature, layer) {
    let popupContent = ''

    if (feature.properties && feature.properties.popupContent) {
      popupContent += feature.properties.popupContent
    }

    layer.bindPopup(popupContent)
  }

  function dateToColor(dateStr) {
    const colorPalette = [
      '#1e88e5',
      '#2196f3',
      '#42a5f5',
      '#64b5f6',
      '#90caf9',
      '#bbdefb',
      '#304ffe',
      '#536dfe',
      '#3f51b5',
      '#1a237e',
      '#283593',
      '#303f9f'
    ]

    try {
      const d = new Date(dateStr)
      const idx = d.getDay() % (colorPalette.length - 1)
      return colorPalette[idx]
    } catch (e) {}

    return colorPalette[0]
  }

  //----------------------------------------------------------------------------------------------------------------
  //
  //
  return {
    createLayer
  }
}
