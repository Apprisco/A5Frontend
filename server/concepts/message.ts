import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface MessageDoc extends BaseDoc {
  user: ObjectId;
  target: ObjectId;
  text: string;
}

export default class MessageConcept {
  public readonly messages = new DocCollection<MessageDoc>("messages");

  async create(user: ObjectId, target: ObjectId, text:string) {
    return { msg: "Message created!", comment: this.messages.createOne({ user: user,target:target,text:text }) };
  }

  async update(user: ObjectId, update: Partial<MessageDoc>) {
    this.sanitizeUpdate(update);
    await this.messages.updateOne({ user }, update);
    return { msg: "Message successfully updated!" };
  }
  
  async delete(_id: ObjectId) {
    await this.messages.deleteOne({_id});
    return { msg: "Message deleted!" };
  }
  async isOwner(user:ObjectId,_id: ObjectId) {
    const comment = await this.messages.readOne({_id});
    if(!comment) throw new NotFoundError("Message does not exist!");
    if (comment.user!==user) {
      throw new CommentNotOwnedError(user,_id);
    }
  }

  async getMessagesByTarget(target: ObjectId) {
    const comments = await this.messages.readMany({target:target},{sort:{dateUpdated:-1}});
    return comments;
  }
  async getMessagesByUser(user: ObjectId) {
    const comments = await this.messages.readMany({user:user},{sort:{dateUpdated:-1}});
    return comments;
  }
  async getMessagesBetween(user:ObjectId,target:ObjectId)
  {
    return await this.messages.readMany({$or:[{user:user,target:target},{target:target,user:user}]},{sort:{dateCreated:-1}});
  }
  private sanitizeUpdate(update: Partial<MessageDoc>) {
    // Make sure the update cannot change the user.
    const allowedUpdates = ["text"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}
export class CommentNotOwnedError extends NotAllowedError {
  constructor(
    public readonly user: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the owner of comment {1}!", user, _id);
  }
}