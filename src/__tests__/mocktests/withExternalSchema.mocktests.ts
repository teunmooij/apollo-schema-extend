import { createTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'
import { getMovieHouseServer } from './mockservers/internal/movieHouse'
import { Movie } from './mockservers/model'

describe('basic withExternalSchema mocktests', () => {
  it('should resolve an external query', async () => {
    // Arrange
    const query = gql`
      query {
        movies {
          id
          title
        }
      }
    `

    const server = await getMovieHouseServer()
    const client = createTestClient(server)

    // Act
    const response = await client.query({ query })

    // Assert
    expect(response.errors).toBeUndefined()
    expect(response.data?.movies).toBeDefined()
    const movies: Movie[] = response.data.movies!
    expect(movies).toHaveLength(2)
  })
})
