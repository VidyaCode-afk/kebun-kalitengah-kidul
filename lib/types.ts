export interface Tree {
  id: number
  tree_code: string
  species_name: string
  latin_name: string
  latitude: number
  longitude: number
  photo_url: string
  description: string
  planted_at?: string
  created_at?: string
  updated_at?: string
  status?: string // <--- TAMBAHKAN INI
}