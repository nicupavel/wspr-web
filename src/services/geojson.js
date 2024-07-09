export default function useGeoJson() {
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
    featurePoint,
    createCollection,
    addToCollection
  }
}
