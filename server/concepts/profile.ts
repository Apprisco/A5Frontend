import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ProfileDoc extends BaseDoc {
  user: ObjectId;
  name: string;
  content: string;
  captions: boolean,
  speech: boolean;
}

export default class ProfileConcept {
  public readonly profiles = new DocCollection<ProfileDoc>("profiles");
  async create(user: ObjectId,name:string,captions:boolean,speech:boolean)
  {
    return {msg:"Profile created!",profile: this.profiles.createOne({user:user, name:name, content:"",captions:captions,speech:speech})};
  }

  async update(user: ObjectId, update:Partial<ProfileDoc>)
  {
    this.sanitizeUpdate(update);
    await this.profiles.updateOne({user},update);
    return {msg: "Profile updated!"};
  }

  async getProfile(user: ObjectId)
  {
    const profile=await this.profiles.readOne({user});
    if(!profile) throw new NotFoundError("Profile for ${user} doesn't exist!");
    return profile;
  }

  private sanitizeUpdate(update: Partial<ProfileDoc>)
  {
    const allowedUpdates = ["name", "content","captions","speech"];
    for(const key in update)
    {
      if(!allowedUpdates.includes(key)) throw new NotAllowedError(`Cannot update '${key}' field!`);
    }
  }
}