<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["friend"]);
const emit = defineEmits(["refreshFriends"]);

async function removeFriend(username: string) {
  try {
    await fetchy(`/api/friends/${username}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshFriends");
}
</script>

<template>
  <div class="friend">
    <div class="author">
      {{ props.friend }}
    </div>
    <div class="base">
        <button class="button-error btn-small pure-button" @click="removeFriend(props.friend)">Remove</button>
    </div>
  </div>
</template>

<style scoped>
.friend {
  display: flex;
  justify-content: space-between;
  border-radius: 20px;
  background-color: white;
  padding: 0.5em;
  margin: 0.5em;
}
.author {
  padding-top: 0.2em;
  font-weight: bold;
  font-size: 1em;
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
    padding-left:1em;
    margin-left:1em;
  background-color: darkgray;
  border-radius: 8px;
}
</style>