<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { useSiteStore } from "@/stores/site";
import router from "@/router";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, watchEffect } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import Navbar from "@/components/Bar/Navbar.vue";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const siteStore = useSiteStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
const { modalVisible } = storeToRefs(siteStore);

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  siteStore.isSigningIn(false);
  siteStore.isSigningUp(false);
  try {
    await userStore.updateSession();
  } catch {
  }
});
const routeTo = (name: string) => {
  router.push({ name:name});
};
watchEffect(() => {
  if (!isLoggedIn.value) {
    routeTo("Home");
  }
});
watchEffect(() => {
  document.documentElement.style.overflowY = modalVisible.value ? "hidden" : "auto";
});
</script>

<template>
  <header>
    <Navbar />
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <div class="page-layout">
 <Suspense>
    <RouterView />
 </Suspense>
  </div>
</template>

<style scoped>
@import "./assets/toast.css";

@font-face {
  font-family: "Proxima Nova Regular";
  src: url("./assets/fonts/PNR.ttf");
}

nav {
  padding: 1em 2em;
  background-color: var(--teal);
  display: flex;
  align-items: center;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}
</style>
