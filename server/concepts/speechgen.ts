import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface SpeechGenDoc extends BaseDoc {
  user: ObjectId;
  audio: string;
  text: string;
}

export default class SpeechGenConcept {
  public readonly speechGens = new DocCollection<SpeechGenDoc>("speechdet");

  async create(user: ObjectId, text: string) {
    return { msg: "Speech Generation created!", comment: this.speechGens.createOne({ user: user,text:text,audio:await this.generateAudio(text) }) };
  }
  private async generateAudio(text:string)
  {
    //TODO: Find text to audio clip library url
    return text;
  }
  async getSpeechGeneration(user: ObjectId,text:string)
  {
    const speechGen = await this.speechGens.readOne({user:user,text:text});
    return speechGen;
  }
}