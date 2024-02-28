import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Profile from "App/Models/Profile";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

const profileSchema = schema.create({
  userId: schema.number(),
  name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
  mobile: schema.string({}, [rules.regex(/^\d{10}$/)]),
  gender: schema.enum(["MALE", "FEMALE"]),
  dateOfBirth: schema.date(),
});

export default class ProfilesController {
  public async index({ request, response }: HttpContextContract) {
    const profileData = await Profile.all();
    return response.status(200).json({ data: profileData });
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate({ schema: profileSchema });
    const profile = await Profile.create({ ...payload });
    return response
      .status(201)
      .json({ message: "Profile created successfully.", data: profile });
  }

  public async show({ request, response, params }: HttpContextContract) {
    try {
      const userId = params.userId;

      const user = await User.query()
        .where("id", userId)
        .preload("profile", (query) => {
          query.select("name", "gender", "dateOfBirth");
        })
        .firstOrFail();

      const profileData = user?.profile?.$original;
      const resObject = {
        name: profileData.name,
        email: user?.$original.email,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth,
      };

      return response.status(200).json(resObject);
    } catch (error) {
      return response.status(404).json({ error: "User profile not found" });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const profileId = params.id;
    const payload = await request.validate({ schema: profileSchema });

    const profile: Profile | null = await Profile.findBy("id", profileId);
    if (!profile) {
      return response.status(404).json({ message: "Profile not found." });
    }
    profile.merge(payload);
    await profile.save();

    return response
      .status(200)
      .json({ message: "Profile updated successfully.", data: profile });
  }

  public async destroy({}: HttpContextContract) {}
}
