import * as maptilersdk from '@maptiler/sdk';

const displayMap = (locations) => {
  // 2. create the map
  const map = new maptilersdk.Map({
    container: 'map',
    apiKey: 'gamLHNDoX99AGnYKG4mp',
    style: 'https://api.maptiler.com/maps/ec0458da-9f79-43bb-bc3c-b8b865c1aae8/style.json?key=gamLHNDoX99AGnYKG4mp',
    center: [0, 0], // [lng, lat]
    zoom: 9,
  });

  const bounds = new maptilersdk.LngLatBounds();
  const markers = [];
  const popups = [];

  map.on('load', () => {
    locations.forEach((loc) => {
      const el = document.createElement('div');
      el.className = 'marker';
      const marker = new maptilersdk.Marker({
        element: el,
      })
        .setLngLat(loc.coordinates)
        .addTo(map);

      markers.push(marker);

      // add popup
      const popup = new maptilersdk.Popup({
        offset: 30,
        closeOnClick: false,
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);
      popups.push(popup);

      bounds.extend(loc.coordinates);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: {
          top: 200,
          bottom: 150,
          left: 100,
          right: 100,
        },
      });
    }
  });
};

export default displayMap;
