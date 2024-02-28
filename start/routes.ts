/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import AuthController from 'App/Controllers/Http/AuthController'
import ProfilesController from 'App/Controllers/Http/ProfilesController'

Route.get('/', async () => {
  return { hello: 'world' }
})
Route.get('/register', async (ctx) => {
  return new AuthController().index(ctx)
})
Route.post('/register', async (ctx) => {
  return new AuthController().store(ctx)
})
Route.post('/login', async ({ auth, request, response }) => {
  return new AuthController().login({ auth, request, response })
})

// Profile routes
Route.get('/user/profile', async (ctx) => {
  return new ProfilesController().index(ctx)
})
Route.get('/user/profile/:userId', async (ctx) => {
  return new ProfilesController().show(ctx)
})
Route.post('/user/profile', async (ctx) => {
  return new ProfilesController().store(ctx)
})
Route.put('/user/profile/:id', async (ctx) => {
  return new ProfilesController().update(ctx)
})