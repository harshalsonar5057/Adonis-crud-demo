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

import Route from "@ioc:Adonis/Core/Route";
import AuthController from "App/Controllers/Http/AuthController";
import ProfilesController from "App/Controllers/Http/ProfilesController";

// Auth routes
Route.post("register", "AuthController.register");
Route.post("login", "AuthController.login");


// Profile routes
Route.group(() => {
Route.get("user/profile", "ProfilesController.index");

Route.get("user/profile/:userId", "ProfilesController.show");

Route.post("user/profile", "ProfilesController.store");

Route.put("user/profile/:id", "ProfilesController.update");

Route.delete("user/profile/:mobile", "ProfilesController.deleteByMobile");

Route.post('logout', "AuthController.logout")
}).middleware("auth:web,api");
