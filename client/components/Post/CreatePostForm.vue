<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const text = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async (text: string) => {
  try {
    await fetchy("/api/posts", "POST", {
      body: { text },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  text.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(text)">
    <label for="text">Post Contents:</label>
    <textarea id="text" v-model="text" placeholder="Create a post!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 7em;
  padding: 0.5em;
  border-radius: 10px;
  border: none;
  resize: none;
  background-color: white;
}
.pure-button {
  background-color: var(--darker-purple);
  border-radius: 8px;
  width: auto;
  font-size: 0.9em;
}
</style>
