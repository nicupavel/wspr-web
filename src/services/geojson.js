export default function useGeoJson() {
  function featurePoint(lat, lon, popupContent) {
    return {
      geometry: {
        type: 'Point',
        coordinates: [lon, lat]
      },
      type: 'Feature',
      properties: {
        popupContent: popupContent
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
