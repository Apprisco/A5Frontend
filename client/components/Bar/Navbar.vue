<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref,watchEffect } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { useSiteStore } from "@/stores/site";
import { useUserStore } from "@/stores/user";
import Button from "@/components/Button/Button.vue";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const siteStore = useSiteStore();
const { isLoggedIn } = storeToRefs(userStore);
const { logoutUser } = useUserStore();
const pageScrolled = ref<boolean>(false);
const tab = ref<string>();
const login = () => {
  siteStore.isSigningIn(true);
};
const logout = async() => {
  await logoutUser();
  siteStore.resetStore();
  routeTo('Home');
};
const handleScroll = () => {
  pageScrolled.value = window.scrollY >= 4;
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
const routeTo = (name: string) => {
  router.push({ name:name });
};
watchEffect(() => {
  if (currentRoute.name) {
    tab.value = currentRoute.name.toString();
  }
});
</script>

<template>
  <nav v-bind:style="pageScrolled.valueOf() ? 'border-bottom-width: 2px' : 'border-bottom-width: 0px'">
    <div class="title">
      <img src="@/assets/images/logo.png" class="logo" draggable="false" />
    </div>
    <div class="buttons">
      <Button v-if="!isLoggedIn" :text="'Log In'" :onClick="login" :width="'100px'" :height="'40px'" :variant="'important'" />
      <Button v-if="isLoggedIn" :text="'Friends'" :onClick="() => routeTo('Friends')" :width="'100px'" :height="'40px'" :variant="'important'" />
      <Button v-if="isLoggedIn" :text="'Posts'" :onClick="() => routeTo('Posts')" :width="'100px'" :height="'40px'" :variant="'important'" />
      <!-- <Button v-if="isLoggedIn" :text="'Messages'" :onClick="() => routeTo('Messages')" :width="'100px'" :height="'40px'" :variant="'important'" /> -->
      <Button v-if="isLoggedIn" :text="'Profile'" :onClick="() => routeTo('Profile')" :width="'100px'" :height="'40px'" :variant="'important'" />
      <Button v-if="isLoggedIn" :text="'Log Out'" :onClick="logout" :width="'100px'" :height="'40px'" :variant="'important'" />
    </div>
  </nav>
</template>

<style scoped>
.logo {
  width: 300px;
  align-self: center;
  margin-right: 20px;
}

.title {
  display: flex;
  flex-direction: row;
  align-items:center;
}
.buttons{
  display: flex;
  flex-direction: row;
  align-items:center;

}
nav {
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: var(--nav-bar-height);
  width: 100%;
  top: 0px;
  margin: 0px;
  padding-right: var(--page-side-padding);
  padding-left: var(--page-side-padding);
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  border-color: black;
  border-style: solid;
  border-width: 0px;
}
</style>
