import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CaptionDoc extends BaseDoc {
  owner: ObjectId;
  image: string;
  text: string;
}

export default class CaptionConcept {
  public readonly captions = new DocCollection<CaptionDoc>("captions");

  async create(owner: ObjectId, image: string) {
    const promise=this.captions.createOne({ owner: owner,image:image,text:await this.generateFromImage(image)});
    return { msg: "Caption generated!", comment: promise };
  }
  
  async delete(_id: ObjectId) {
    await this.captions.deleteOne({owner:_id});
    return { msg: "Caption deleted!" };
  }
  async isOwner(owner:ObjectId,_id: ObjectId) {
    const caption = await this.captions.readOne({_id});
    if(!caption) throw new NotFoundError("Caption does not exist!");
    if (caption.owner!==owner) {
      throw new CaptionNotOwnedError(owner,_id);
    }
  }

  async getCaptionsByPost(target: ObjectId,image:string) {
    const captions = await this.captions.readMany({owner:target,image:image},{sort:{dateUpdated:-1}});
    return captions;
  }

  async regenerate(target: ObjectId,image:string) {
    const captions = await this.captions.readOne({owner:target,image:image},{sort:{dateUpdated:-1}});
    await this.update(target,image,{text:await this.generateFromImage(image)});
    return captions;
  }

  private async generateFromImage(image:string)
  {
    //TODO: add library for image url to caption generator
    return image;
  }

  async update(user: ObjectId, image:string,update: Partial<CaptionDoc>) {
    this.sanitizeUpdate(update);
    await this.captions.updateOne({owner:user,image:image }, update);
    return { msg: "Caption successfully updated!" };
  }
  private sanitizeUpdate(update: Partial<CaptionDoc>) {
    // Make sure the update cannot change the user.
    const allowedUpdates = ["text"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}
export class CaptionNotOwnedError extends NotAllowedError {
  constructor(
    public readonly user: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the owner of caption {1}!", user, _id);
  }
}