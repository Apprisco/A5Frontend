import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CommentDoc extends BaseDoc {
  user: ObjectId;
  target: ObjectId;
  text: string;
}

export default class CommentConcept {
  public readonly comments = new DocCollection<CommentDoc>("comments");

  async create(user: ObjectId, target: ObjectId, text:string) {
    return { msg: "Comment created!", comment: this.comments.createOne({ user: user,target:target,text:text }) };
  }

  async update(user: ObjectId, update: Partial<CommentDoc>) {
    this.sanitizeUpdate(update);
    await this.comments.updateOne({ user }, update);
    return { msg: "Comment successfully updated!" };
  }
  
  async delete(_id: ObjectId) {
    await this.comments.deleteOne({_id});
    return { msg: "Comment deleted!" };
  }
  async isOwner(user:ObjectId,_id: ObjectId) {
    const comment = await this.comments.readOne({_id});
    if(!comment) throw new NotFoundError("Comment does not exist!");
    if (comment.user!==user) {
      throw new CommentNotOwnedError(user,_id);
    }
  }

  async getCommentsByTarget(target: ObjectId) {
    const comments = await this.comments.readMany({target:target},{sort:{dateUpdated:-1}});
    return comments;
  }
  async getCommentsByUser(user: ObjectId) {
    const comments = await this.comments.readMany({user:user},{sort:{dateUpdated:-1}});
    return comments;
  }

  private sanitizeUpdate(update: Partial<CommentDoc>) {
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