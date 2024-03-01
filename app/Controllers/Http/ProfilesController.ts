import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Profile from "App/Models/Profile";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

const profileSchema = schema.create({
  userId: schema.number(),
  name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
  mobile: schema.number([
    rules.range(1000000000, 9999999999)
  ]),
  gender: schema.string(),
  dateOfBirth: schema.date(),
});

export default class ProfilesController {

  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: profileSchema });
       const profile = await Profile.create({
        userId: payload.userId,
        name: payload.name,
        mobile: payload.mobile,
        gender: payload.gender as Gender, // Type assertion to 'Gender'
        dateOfBirth: payload.dateOfBirth,
      });
      return response
        .status(201)
        .json({ message: "Profile created successfully.",  data:profile });
    } catch (error) {
      return response.badRequest(error);
    }
  }

  public async show({ response, params }: HttpContextContract) {
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
    try {
      const profileId = params.id;
      const payload = await request.validate({ schema: profileSchema });

      const profile = await Profile.findBy("id", profileId);
      if (!profile) {
        return response.status(404).json({ message: "Profile not found." });
      }
      profile.merge({
        userId: payload.userId,
        name: payload.name,
        mobile: payload.mobile,
        gender: payload.gender as Gender,
        dateOfBirth: payload.dateOfBirth,
      });
      await profile.save();

      return response
        .status(200)
        .json({ message: "Profile updated successfully.", data: profile });
    } catch (error) {
      return response.badRequest(error);
    }
  }

  public async deleteByMobile({ params, response }: HttpContextContract) {
    try {
      const { mobile } = params;

      const profile = await Profile.findBy("mobile", mobile);
      if (!profile) {
        return response.status(404).json({ error: "Profile not found" });
      }
      // Find user associated with the profile
      const user = await profile.related("user").query().firstOrFail();

      await profile.delete();

      await user.delete();

      return response
        .status(200)
        .json({ message: "User and profile deleted successfully" });
    } catch (error) {
      return response.badRequest(error);
    }
  }
}
