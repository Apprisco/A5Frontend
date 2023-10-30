<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["req"]);
const emit = defineEmits(["refreshReqs", "refreshFriends"]);

const { currentUsername } = storeToRefs(useUserStore());

async function removeFriendRequest(username: string) {
  try {
    await fetchy(`/api/friend/requests/${username}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshReqs");
}

async function acceptFriendRequest(username: string) {
  try {
    await fetchy(`/api/friend/accept/${username}`, "PUT");
  } catch {
    return;
  }
  emit("refreshReqs");
  emit("refreshFriends");
}

async function rejectFriendRequest(username: string) {
  try {
    await fetchy(`/api/friend/reject/${username}`, "PUT");
  } catch {
    return;
  }
  emit("refreshReqs");
}
</script>

<template>
  <div v-if="props.req.from == currentUsername">
    <div class="base">
      <p>{{ props.req.to }}</p>
      <p>status: {{ props.req.status }}</p>
      <menu v-if="props.req.status == 'pending'">
        <li><button class="button-error pure-button small" @click="removeFriendRequest(props.req.to)">Remove</button></li>
      </menu>
    </div>
  </div>
  <div v-else>
    <div class="base">
      <p>{{ props.req.from }}</p>
      <p>status: {{ props.req.status }}</p>
      <menu v-if="props.req.status == 'pending'">
        <button class="pure-button small" @click="acceptFriendRequest(props.req.from)">Accept</button>
        <button class="pure-button button-error small" @click="rejectFriendRequest(props.req.from)">Reject</button>
      </menu>
    </div>
  </div>
</template>

<style scoped>
section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 5px;
  margin: 0;
}

.pure-button {
  border-radius: 8px;
  margin-bottom: 0.5em;
  background-color: var(--dark-purple);
  font-size: 1em;
  color: white;
}
.base {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 10em;
}

.base article:only-child {
  margin-left: auto;
}
</style>