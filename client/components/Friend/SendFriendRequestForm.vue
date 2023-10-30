<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const emit = defineEmits(["refreshReqs"]);
let to = ref("");

async function sendFriendRequest(username: string) {
  try {
    await fetchy(`/api/friend/requests/${username}`, "POST");
  } catch (_) {
    return;
  }
  to.value = "";
  emit("refreshReqs");
}
</script>

<template>
  <form @submit.prevent="sendFriendRequest(to)" class="pure-form">
    <p>Send Friend Request To</p>
    <input type="text" v-model="to" placeholder="username" required />
    <button type="submit" class="pure-button pure-button-primary">Send</button>
  </form>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}
.pure-button {
  border-radius: 8px;
  background-color: var(--darker-purple);
  font-size: 1em;
  color: white;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>