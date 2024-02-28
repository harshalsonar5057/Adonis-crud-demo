import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken';
import Env from '@ioc:Adonis/Core/Env'

export default class AuthMiddleware {
  public async handle ({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const token = request.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return response.unauthorized('Missing token')
    }

    try {
      const payload = await jwt.verify(token, Env.get('JWT_SECRET'))
      console.log("payload=>",payload)
      request['authenticatedUser'] = payload
      await next()
    } catch (error) {
      return response.unauthorized('Invalid token')
    }
  }
}
