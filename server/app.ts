import CaptionConcept from "./concepts/caption";
import CommentConcept from "./concepts/comment";
import FriendConcept from "./concepts/friend";
import MessageConcept from "./concepts/message";
import PostConcept from "./concepts/post";
import ProfileConcept from "./concepts/profile";
import SpeechDetConcept from "./concepts/speechdet";
import SpeechGenConcept from "./concepts/speechgen";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Message = new MessageConcept();
export const Profile = new ProfileConcept();
export const Comment = new CommentConcept();
export const Caption = new CaptionConcept();
export const SpeechGen = new SpeechGenConcept();
export const SpeechDet = new SpeechDetConcept();
