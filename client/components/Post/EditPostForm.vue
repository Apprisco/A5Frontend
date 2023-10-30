<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const text = ref(props.post.text);
const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async (text: string) => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { update: { text: text } } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <form @submit.prevent="editPost(text)">
    <p class="author">{{ props.post.author }}</p>
    <textarea id="text" v-model="text" placeholder="Create a post!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editPost')">Cancel</button></li>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border-radius: 1em;
  padding: 1em;
}
.base .pure-button {
  background-color: var(--purple);
  border-radius: 6px;
  margin-bottom: 0.5em;
  border-color: var(--darker-purple);
  color: black;
}

.base .button-error {
  background-color: var(--purple);
  color: gray;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 6px;
  resize: none;
  border: none;
  padding: 0.5em;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
