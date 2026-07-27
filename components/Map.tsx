'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Tree } from '@/lib/types'

// Fix icon marker Leaflet di Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export default function Map({ trees }: { trees: Tree[] }) {
  const defaultLat = trees.length > 0 ? trees[0].latitude : -7.5898
  const defaultLng = trees.length > 0 ? trees[0].longitude : 110.4502

  return (
    <MapContainer
      center={[defaultLat, defaultLng]}
      zoom={18}
      scrollWheelZoom={false}
      className="h-[420px] w-full rounded-2xl shadow-md border border-slate-200 z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trees.map((tree) => (
        <Marker
          key={tree.id}
          position={[tree.latitude, tree.longitude]}
          icon={customIcon}
        >
          <Popup>
            <div className="p-1 max-w-[200px]">
              <img
                src={tree.photo_url}
                alt={tree.tree_code}
                className="w-full h-24 object-cover rounded-md mb-2"
              />
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                {tree.tree_code}
              </span>
              <h4 className="font-bold text-sm text-slate-800 mt-1">
                {tree.species_name}
              </h4>
              <p className="text-xs italic text-slate-500">{tree.latin_name}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}