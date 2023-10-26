import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface SpeechDetDoc extends BaseDoc {
  user: ObjectId;
  audio: string;
  text: string;
}

export default class SpeechDetConcept {
  public readonly speechDets = new DocCollection<SpeechDetDoc>("speechdet");

  async create(user: ObjectId, audio: string) {
    return { msg: "Speech Detection created!", comment: this.speechDets.createOne({ user: user,audio:audio,text:await this.generateText(audio) }) };
  }
  private async generateText(audio:string)
  {
    //TODO: Find audio clip url to text library
    return audio;
  }
  async getSpeechDetection(user: ObjectId,audio:string)
  {
    const speechDet = await this.speechDets.readOne({user:user,audio:audio});
    return speechDet;
  }
}