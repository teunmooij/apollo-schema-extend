import { Movie } from '../../model'

export const rating = (root: Movie) => {
  if (root.id === '1') return 'G'
  return 'PG'
}
