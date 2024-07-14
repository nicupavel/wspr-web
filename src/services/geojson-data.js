export default function useGeoJsonData() {
  function fromData(dataArray) {
    const geoData = createCollection()
    for (const entry of dataArray) {
      const point = featurePoint(entry.lat, entry.lon, {
        popupContent: `${entry.date}: ${entry.maidenhead}`,
        precision: entry.precision,
        date: entry.date
      })
      addToCollection(geoData, point)
    }
    return geoData
  }

  //----------------------------------------------------------------------------------------------------------------
  //
  //
  function featurePoint(lat, lon, properties) {
    return {
      geometry: {
        type: 'Point',
        coordinates: [lon, lat]
      },
      type: 'Feature',
      properties: {
        ...properties
      }
    }
  }

  function createCollection() {
    return {
      type: 'FeatureCollection',
      features: []
    }
  }

  function addToCollection(featureCollection, feature) {
    featureCollection.features.push(feature)
  }

  //----------------------------------------------------------------------------------------------------------------
  //
  //
  return {
    fromData
  }
}
