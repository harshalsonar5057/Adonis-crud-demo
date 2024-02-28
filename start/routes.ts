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
Route.get("/", async () => {
  return { hello: "world" };
});

Route.post("register", "AuthController.store");

Route.post("login", "AuthController.login");

Route.get("register", "AuthController.index").middleware("auth");

// Profile routes
Route.get("user/profile", "ProfilesController.index").middleware("auth");

Route.get("user/profile/:userId", "ProfilesController.show").middleware("auth");

Route.post("user/profile", "ProfilesController.store").middleware("auth");

Route.put("user/profile/:id", "ProfilesController.update").middleware("auth");

Route.delete(
  "user/profile/:mobile",
  "ProfilesController.deleteByMobile"
).middleware("auth");
