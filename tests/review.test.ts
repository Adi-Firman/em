import request from 'supertest'
import app from '../app'  // pastikan ini path ke aplikasi Express kamu

describe('POST /reviews/:eventId', () => {
  it('should return 201 if review is submitted successfully', async () => {
    const response = await request(app)
      .post('/reviews/1')  // Gantilah dengan ID event yang sesuai
      .send({
        rating: 5,
        comment: 'Amazing event! Highly recommended.',
      })
      .set('Authorization', 'Bearer YOUR_JWT_TOKEN')  // Kirimkan token otentikasi jika diperlukan

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('rating', 5)
    expect(response.body).toHaveProperty('comment', 'Amazing event! Highly recommended.')
  })

  it('should return 400 if the user hasn\'t attended the event', async () => {
    const response = await request(app)
      .post('/reviews/1')  // Gantilah dengan ID event yang sesuai
      .send({
        rating: 4,
        comment: 'Nice event.',
      })
      .set('Authorization', 'Bearer YOUR_JWT_TOKEN')  // Kirimkan token otentikasi jika diperlukan

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', 'You must attend the event to leave a review')
  })
})
