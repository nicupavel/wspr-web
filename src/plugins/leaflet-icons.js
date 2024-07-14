export function useLeafletIcons() {
  return {
    circleIcon: (size, color) =>
      L.divIcon({
        html: `
            <svg
            width="${size}"
            height="${size}"
            viewBox="0 0 ${size} ${size}"
            >
            <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${color}" stroke-width=1 stroke="#636363"/>
            </svg>`,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      }),

    rectangleIcon: (size, color) =>
      L.divIcon({
        html: `
            <svg
            width="${size}"
            height="${size}"
            viewBox="0 0 ${size} ${size}"
            >
            <rect width="${size}" height="${size}" rx="${size / 6}"  fill="${color}" stroke-width=1 stroke="#636363" />
            </svg>`,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      }),

    triangleIcon: (size, color) =>
      L.divIcon({
        html: `
            <svg
            width="${size}"
            height="${size}"
            viewBox="0 0 ${size} ${size}"
            >
            <polygon points="${size / 2} ${size - (size * Math.sqrt(3)) / 2},  ${size}  ${size}, 0 ${size}" fill="${color} stroke-width=1 stroke="#636363"/>
            </svg>`,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      })
  }
}
