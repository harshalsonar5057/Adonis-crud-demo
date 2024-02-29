import { DateTime } from "luxon";
import {
  BaseModel,
  HasOne,
  beforeSave,
  column,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import Profile from "./Profile";
import Hash from "@ioc:Adonis/Core/Hash";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column()
  public password: string;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @column()
  public api_token: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasOne(() => Profile, {
    foreignKey: "userId",
  })
  public profile: HasOne<typeof Profile>;
}
