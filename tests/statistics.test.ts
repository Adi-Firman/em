import request from 'supertest'
import app from '../app'

describe('GET /statistics/event-statistics', () => {
  it('should return 200 with event statistics', async () => {
    const response = await request(app)
      .get('/statistics/event-statistics')
      .set('Authorization', 'Bearer YOUR_JWT_TOKEN')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('eventName')
    expect(response.body[0]).toHaveProperty('totalRevenue')
    expect(response.body[0]).toHaveProperty('totalTicketsSold')
    expect(response.body[0]).toHaveProperty('averageRating')
  })

  it('should return 401 if the user is not authenticated', async () => {
    const response = await request(app)
      .get('/statistics/event-statistics')

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('error', 'Unauthorized')
  })
})
