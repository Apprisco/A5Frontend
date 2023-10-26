import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Caption, Comment, Friend, Message, Post, Profile, SpeechDet, SpeechGen, User, WebSession } from "./app";
import { CommentDoc } from "./concepts/comment";
import { PostDoc } from "./concepts/post";
import { ProfileDoc } from "./concepts/profile";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);

  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    const user= await User.create(username, password);
    if(user.user) await Profile.create(user.user._id);
    return user;
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(session: WebSessionDoc,author?: string) {
    const user = WebSession.getUser(session),friends=await Friend.getFriends(user);
    let posts;
    //display all posts of friends if no author is specified, otherwise make sure only friends can see posts
    if (author) {
      const authorId = (await User.getUserByUsername(author))._id;
      if(authorId!==user) await Friend.isFriends(user,authorId);
      posts = await Post.getByAuthor(authorId);
    }
    else posts = await Post.getPosts({author:{$in:friends}});
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, text: string, image: string) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, text, image);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }
  @Router.get("/comments")
  async getCommentsByUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Comment.getCommentsByUser(user);
  }

  @Router.get("/posts/:_target/comments")
  async getCommentsByPost(session: WebSessionDoc, _target: ObjectId) {
    const user = WebSession.getUser(session);
    await isFriendWithPostOwner(user,_target);
    return await Comment.getCommentsByTarget(_target);
  }
  @Router.post("/posts/:_target/comments")
  async createComment(session: WebSessionDoc, _target: ObjectId, text: string) {
    const user = WebSession.getUser(session);
    await isFriendWithPostOwner(user,_target);
    return await Comment.create(user, _target, text);
  }
  @Router.patch("/posts/:_target/comments/:_id")
  async updateComment(session: WebSessionDoc, _target: ObjectId, _id: ObjectId, update: Partial<CommentDoc>) {
    const user = WebSession.getUser(session);
    await isFriendWithPostOwner(user,_target);
    await Comment.isOwner(user, _id);
    return await Comment.update(_id, update);
  }
  @Router.delete("/posts/:_target/comments:_id")
  async deleteComment(session: WebSessionDoc, _target: ObjectId, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await isFriendWithPostOwner(user,_target);
    await Comment.isOwner(user, _id);
    return await Comment.delete(_id);
  }
  @Router.get("/posts/:_target/captions")
  async createCaption(session: WebSessionDoc, _target: ObjectId, _image:string) {
    const user = WebSession.getUser(session);
    await isFriendWithPostOwner(user,_target);
    return await Caption.create(_target,_image);
  }
  @Router.get("/posts/:_target/captions")
  async regenerateCaption(session: WebSessionDoc, _target: ObjectId, _image:string) {
    const user = WebSession.getUser(session);
    await isFriendWithPostOwner(user,_target);
    return await Caption.regenerate(_target,_image);
  }
  @Router.get("/posts/:_target/captions")
  async getCaptionsByPost(session: WebSessionDoc, _target: ObjectId,_image:string) {
    const user = WebSession.getUser(session);
    await isFriendWithPostOwner(user,_target);
    return await Caption.getCaptionsByPost(_target,_image);
  }
  @Router.patch("/profiles")
  async updateProfile(session: WebSessionDoc, update:Partial<ProfileDoc>)
  {
    const user=WebSession.getUser(session);
    return await Profile.update(user, update);
  }

  @Router.get("/profiles")
  async getProfile(session: WebSessionDoc, owner?: string)
  {
    const id = owner ? (await User.getUserByUsername(owner))._id : WebSession.getUser(session);
    return await Profile.getProfile(id);
  }

  @Router.get("/messages")
  async getMessages(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Message.getMessagesByUser(user);
  }

  @Router.get("/messages/:username")
  async getMessagesBetween(session: WebSessionDoc,username:string) {
    const user= WebSession.getUser(session);
    const target = await User.getUserByUsername(username);
    return await Message.getMessagesBetween(user,target._id);
  }

  @Router.post("/messages/:to")
  async sendMessage(session: WebSessionDoc, _target: string, text: string) {
    const user = WebSession.getUser(session);
    const target = (await User.getUserByUsername(_target))._id;
    await Friend.isFriends(user,target);
    return await Message.create(user,target,text);
  }
  
  @Router.get("/speechGen")
  async createGen(session: WebSessionDoc,text:string) {
    const user = WebSession.getUser(session);
    return await SpeechGen.create(user,text);
  }
  @Router.get("/speechGen")
  async getGen(session: WebSessionDoc,text:string) {
    const user = WebSession.getUser(session);
    return await SpeechGen.getSpeechGeneration(user,text);
  }
  @Router.get("/speechDet")
  async createDet(session: WebSessionDoc,audio:string) {
    const user = WebSession.getUser(session);
    return await SpeechDet.create(user,audio);
  }
  @Router.get("/speechDet")
  async getDet(session: WebSessionDoc,audio:string) {
    const user = WebSession.getUser(session);
    return await SpeechDet.getSpeechDetection(user,audio);
  }
}
async function isFriendWithPostOwner(user: ObjectId, id: ObjectId)
{
  const post = (await Post.getPosts({ _id: id }))[0];
  if (post.author!==user) await Friend.isFriends(post.author, user);
}
export default getExpressRouter(new Routes());