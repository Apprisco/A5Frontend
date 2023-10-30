<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { useSiteStore } from "@/stores/site";
import { storeToRefs } from "pinia";
import Signup from "@/components/Modal/Signup.vue";
import Login from "@/components/Modal/Login.vue";
import Button from "@/components/Button/Button.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const siteStore = useSiteStore();
const signUp = (): void => {
  siteStore.isSigningUp(true);
};
</script>

<template>
  <main>
    <div class="container">
      <div class="left-container">
          <h1 class="title bold huge-text">No Need For Sight.</h1>
          <h2 class="medium-text blurb">
            VisiLink is designed solely to be used by visually impaired users and friends or family. Don't let your disabilities weigh your connections down in the digital world. Make online communication be as trivial as it should be, no matter your ability.
          </h2>
          <h2 class="medium-text">Join VisiLink today!</h2>
          <Button :text="'Join Us'" :onClick="signUp" :width="'150px'" :height="'40px'" :variant="'important'" />
      </div>
      <div class="right-container">
          <img class="front-image" src="@/assets/images/homepage.png" draggable="false" />
      </div>
    </div>
    <div v-if="siteStore.signingIn">
      <Login />
    </div>
    <div v-else-if="siteStore.signingUp">
      <Signup />
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