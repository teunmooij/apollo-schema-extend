export type MovieGenre = 'Action' | 'Comedy' | 'Horror' | 'ScienceFiction'

export interface Movie {
  id: string
  title: string
  genre: MovieGenre
  description?: string
  rating?: string
}
