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

  it('should relay error message', async () => {
    // Arrange
    const query = gql`
      query {
        movies {
          id
          title
          genre
        }
      }
    `

    const server = await getMovieHouseServer()
    const client = createTestClient(server)

    // Act
    const response = await client.query({ query })

    // Assert
    expect(response.errors).toHaveLength(1)
    const [error] = response.errors!
    expect(error.message).toEqual('Cannot resolve field movies.')
    expect(error.extensions).toBeDefined()
    expect(error.extensions!.errors).toHaveLength(1)
    const [originalError] = error.extensions!.errors!
    expect(originalError.message).toEqual('Cannot return null for non-nullable field Movie.genre.')
  })
})
