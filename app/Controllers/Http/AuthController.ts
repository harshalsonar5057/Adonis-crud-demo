import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Hash from "@ioc:Adonis/Core/Hash";
import jwt from 'jsonwebtoken';
import Env from '@ioc:Adonis/Core/Env'

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

  public async login({ request, response }) {
    try {
      const payload = await request.validate({ schema: userSchema });
      const user: User | null = await User.findBy("email", payload.email);
      if (!user) {
        return response.status(404).json({ message: "user not found." });
      }
      const savedPassword = user?.$original.password;
      const isPasswordValid = await Hash.verify(
        savedPassword,
        payload.password
      );
      if (!isPasswordValid) {
        return response.unauthorized("Invalid credentials");
      }
      const secretkey =  Env.get('JWT_SECRET');
      const token = jwt.sign({ userId:user?.$original.id, email: payload.email}, secretkey, { expiresIn: '1h' });
      return response.status(200).json({ token, user });
    } catch (error) {
      return response.badRequest(error.messages);
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
      return response
        .status(200)
        .json({ messages: "User registered successfully.", data: user });
    } catch (error) {
     return response.badRequest(error.messages);
    }
  }

}
