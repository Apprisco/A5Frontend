<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["comment"]);
const emit = defineEmits(["refresh"]);

const deleteComment = async () => {
  try {
    await fetchy(`/api/comments/${props.comment._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refresh");
};
const fetchProfile = async () => {
  let profile;
  try {
    profile= await fetchy(`/api/profiles`, "GET",{query:props.comment.user});
  } catch {
    return;
  }
  return profile;
};
const fetchUser = async()=>{
  let user;
  try {
    user= await fetchy(`/api/users/${currentUsername.value}`, "GET");
  } catch {
    return;
  }
  return user._id;
}
const owner=await fetchProfile();
const user=await fetchUser();
</script>

<template>
  <div class="comment">
    <div class="author">
      {{owner.name}}
    </div>
    <div class="text">
      <p>{{ props.comment.text }}</p>
    </div>
    <div class="base">
      <div v-if="owner.user==user">
        <button class="button-error btn-small pure-button" @click="deleteComment">delete</button>
      </div>
      <article class="timestamp">
        <p>{{ formatDate(props.comment.dateCreated) }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}
.comment {
  border-radius: 20px;
  background-color: white;
  padding: 0.5em;
  margin: 0.5em;
}
.author {
  font-size: 0.8em;
  font-weight: 200;
  padding-top: 0.2em;
}

.text {
  font-size: 0.8em;
  padding-right: 1em;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
}

.base article:only-child {
  margin-left: auto;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.7em;
  font-style: italic;
  padding-right: 1em;
  padding-left: 1em;
}

.pure-button {
  background-color: darkgray;
  border-radius: 8px;
}
</style>
