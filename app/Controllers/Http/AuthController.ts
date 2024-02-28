import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Hash from "@ioc:Adonis/Core/Hash";

const userSchema = schema.create({
  email: schema.string({}, [rules.email()]),
  password: schema.string({}, [
    rules.minLength(8),
    rules.maxLength(16),
    rules.regex(/[a-zA-Z0-9]+/),
  ]),
});
export default class AuthController {
  public async index({ request, response }: HttpContextContract) {
    const users = await User.all();
    return response.status(200).json({ data: users });
  }

  public async login({ request, auth, response }) {
    try {
      const payload = await request.validate({ schema: userSchema });
      const user: User | null = await User.findBy("email", payload.email);
      console.log("users :", user?.$original.password);
      const savedPassword = user?.$original.password;
      const isPasswordValid = await Hash.verify(
        savedPassword,
        payload.password
      );
      console.log("isPasswordValid :", isPasswordValid);

      if (!isPasswordValid) {
        return response.unauthorized("Invalid credentials");
      }
      const token = await auth.use("api").generate(user);
      console.log("token :>> ", token);
      return user;
    } catch (error) {
      response.badRequest(error.messages);
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: userSchema });

      const hashedPassword = await Hash.make(payload.password);

      const user = new User();
      user.email = payload.email;
      user.password = hashedPassword;

      await user.save();
      //  user.password  = ''
      return response
        .status(200)
        .json({ messages: "User registered successfully.", data: user });
    } catch (error) {
      response.badRequest(error.messages);
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
