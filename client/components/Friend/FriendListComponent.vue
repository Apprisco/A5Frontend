<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

import FriendComponent from "./FriendComponent.vue";
import FriendRequestComponent from "./FriendRequestComponent.vue";
import SendFriendRequestForm from "./SendFriendRequestForm.vue";

const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
let friends = ref<Array<Record<string, string>>>([]);
let reqs = ref<Array<Record<string, string>>>([]);

async function getFriendRequests() {
  let friendReqResults;
  try {
    friendReqResults = await fetchy("/api/friend/requests", "GET");
  } catch (e) {
    console.log(e);
    return;
  }
  reqs.value = friendReqResults;
}

async function getFriends() {
  let friendResults;
  try {
    friendResults = await fetchy("/api/friends", "GET");
  } catch (e) {
    console.log(e);
    return;
  }

  friends.value = friendResults;
}

onBeforeMount(async () => {
  await getFriends();
  await getFriendRequests();
  loaded.value = true;
});
</script>

<template>
   <main>
    <div class="container">
        <div class="left-container">
            <div class="row" v-if="loaded && friends.length !== 0">
                <article v-for="friend in friends" :key="friend._id">
                <FriendComponent :friend="friend" @refreshFriends="getFriends" />
                </article>
            </div>
            <p v-else-if="loaded">No friends found</p>
            <p v-else>Loading...</p>
        </div>
        
        <div class="right-container">
            <h2>Friend Requests</h2>
            <SendFriendRequestForm @refreshReqs="getFriendRequests" />
            <h3>To:</h3>
            <div v-if="loaded && reqs.filter((r) => r.from == currentUsername).length !== 0">
                <article v-for="req in reqs.filter((r) => r.from == currentUsername)" :key="req._id">
                <FriendRequestComponent v-if="req.from == currentUsername" :req="req" @refreshReqs="getFriendRequests" @refreshFriends="getFriends" />
                </article>
            </div>
            <p v-else-if="loaded">No requests found</p>
            <p v-else>Loading...</p>
            <h3>From:</h3>
            <div v-if="loaded && reqs.filter((r) => r.from !== currentUsername).length !== 0">
                <article v-for="req in reqs.filter((r) => r.from !== currentUsername)" :key="req._id">
                <FriendRequestComponent v-if="req.from !== currentUsername" :req="req" @refreshReqs="getFriendRequests" @refreshFriends="getFriends" />
                </article>
            </div>
            <p v-else-if="loaded">No requests found</p>
            <p v-else>Loading...</p>
        </div>
    </div>
   </main>
</template>

<style scoped>
.left-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 50%;
  max-height: 100%;
  padding: 0px 50px 50px 50px;
}
.right-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 50%;
}
main {
  display: flex;
  width: 100%;
  height: 100%;
}
.container {
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-left: var(--page-side-padding);
  padding-right: var(--page-side-padding);
  box-sizing: border-box;
  padding-top: 85px;
}
</style>