<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const emit = defineEmits(["refresh"]);
const props = defineProps(["post"]);

const createComment = async (comment: string) => {
  try {
    await fetchy("api/comments", "POST", {
      body: { _target: props.post._id, text:comment },
    });
  } catch (_) {
    return;
  }
  emit("refresh");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createComment(content)">
    <textarea id="content" v-model="content" placeholder="write a comment!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">post</button>
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
  font-size: 0.9em;
  height: 1.5em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
  border: none;
  background-color: white;
}

.pure-button {
  background-color: var(--dark-purple);
  border-radius: 8px;
  width: auto;
  font-size: 0.9em;
}
</style>
