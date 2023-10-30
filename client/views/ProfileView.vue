<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { fetchy } from "@/utils/fetchy";
import Profile from "@/components/Modal/Profile.vue"
import Button from "@/components/Button/Button.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import router from "@/router";
import { watchEffect } from "vue";

const { currentUsername } = storeToRefs(useUserStore());
const siteStore=useSiteStore();
const fetchProfile = async () => {
  let profile;
  try {
    profile= await fetchy(`/api/profiles`, "GET",{});
  } catch {
    return;
  }
  return profile;
};
const routeTo = (name: string) => {
  router.push({ name });
};
let profile=await fetchProfile();
const editProfile=async ()=>{
  siteStore.isEditingProfile(true);
};
</script>

<template>
  <main>
    <h1 style="">{{profile.name}}</h1>
    <div class="row">
      <h2>Introduction: {{profile.content}}</h2>
    </div>
    <div class="row">
      <h2>Caption Features: {{profile.captions}}</h2>
    </div>
    <div class="row">
      <h2>Speech Features: {{profile.speech}}</h2>
    </div>
    <div class="row">
      <Button :text="'Edit'" :width="'180px'" :onClick="editProfile" :isDisabled="false" :variant="'important'" />
    </div>
    <div v-if="siteStore.editProfile">
      <Profile />
    </div>
    <PostListComponent />

  </main>
</template>

<style scoped>

h1,
h2 {
  text-align: center;
}

h1 {
  font-size: 2em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

.button {
  padding: 1em;
  background-color: lightgray;
  border-radius: 20px;
  font-size: 1em;
}
main {
  margin-top:120px;
}
</style>