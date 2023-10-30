<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const { currentUsername } = storeToRefs(useUserStore());
import { fetchy } from "@/utils/fetchy";
const fetchProfile = async () => {
  let profile;
  try {
    profile= await fetchy(`/api/profiles`, "GET",{});
  } catch {
    console.log(e.message);
    return;
  }
  return profile;
};
let profile=await fetchProfile();
const name=profile.name;
</script>

<template>
  <main>
    <div class="container">
      <Suspense>
        <h1 class="title bold huge-text">{{name}}</h1>
      </Suspense>
      <div class="row">
        
      </div>

      <div>
        <!-- <PostListComponent :owner="currentUsername" /> -->
        <!-- <UserReviewsComponent :own="true" />
        <JobListComponent :own="true" /> -->
      </div>
    </div>
  </main>
</template>

<style scoped>

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
  color: black;
}
.blurb {
  line-height: 125%;
}
main {
  display: flex;
  width: 100%;
  height: 100%;
}
.title {
  margin: 0px;
}
.left-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 60%;
  max-height: 100%;
  padding: 0px 50px 50px 50px;
}
.right-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-width: 25%;
}
.front-image {
  width: 800px;
}
</style>