import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

const userSchema = schema.create({
  email: schema.string({}, [rules.email()]),
  password: schema.string({}, [
    rules.minLength(8),
    rules.maxLength(16),
    rules.regex(/[a-zA-Z0-9]+/),
  ]),
});
export default class AuthController {
  public async login({ auth, request, response }) {
    try {
      const payload = await request.validate({ schema: userSchema });
      const user: User | null = await User.findBy("email", payload.email);

      if (!user) {
        return response.status(404).json({ message: "user not found." });
      }
      const token = await auth
        .use("api")
        .attempt(payload.email, payload.password);
      return response.status(200).json({ token, user });
    } catch (error) {
      return response.badRequest(error);
    }
  }
  public async logout({ auth, request, response }) {
    try {
      await auth.use("api").revoke();
      return {
        revoked: true,
      };
    } catch (error) {
      return response.badRequest(error);
    }
  }

  public async register({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: userSchema });
      const user = await User.create(payload);
      return response
        .status(201)
        .json({ message: "User registered successfully", user });
    } catch (error) {
      return response.badRequest(error);
    }
  }
}
