<script setup lang="ts">
import router from "../../router";
import { useSiteStore } from "@/stores/site";
import { useUserStore } from "@/stores/user";
import { computed, ref } from "vue";
import Button from "../Button/Button.vue";

const username = ref("");
const password = ref("");
const name = ref("");
const caption=ref(true);
const speech=ref(true);
const { loginUser, createUser, updateSession } = useUserStore();
const { isSigningUp, isSigningIn } = useSiteStore();

const signUp = async () => {
  await createUser(username.value, password.value,name.value,caption.value,speech.value);
  await loginUser(username.value, password.value);
  await updateSession();
  isSigningUp(false);
  isSigningIn(false);
  router.push({ name: "Profile" });
};

const isDisabled = computed(() => ![username, password].every((ref) => ref.value.length > 0));

function goBack() {
  isSigningIn(false);
  isSigningUp(false);
}
</script>

<template>
  <div class="modal-container" @click="goBack">
    <div class="content" v-on:click.stop>
      <h1 class="large-text">Get Started</h1>
      <div class="input-container">
        <input v-model.trim="name" class="textField" type="text" placeholder="Name" />
        <input v-model.trim="username" class="textField" type="text" placeholder="Username" />
        <input v-model.trim="password" class="textField" type="password" placeholder="Password" />
        <p>Captioning Feature: 
        <input v-model.trim="caption" class="checkbox" type='checkbox'></p>
        <p>Speech Feature: 
        <input v-model.trim="speech" class="checkbox" type='checkbox'></p>
      </div>
      <Button :text="'Sign Up'" :width="'200px'" :onClick="signUp" :isDisabled="isDisabled" :variant="'important'" />
    </div>
  </div>
</template>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
}

.content {
  min-width: 400px;
  min-height: 480px;
  flex-direction: column;
  align-items: center;
  display: flex;
  width: 30%;
  height: 70%;
  justify-content: space-between;
  border-radius: 7px;
  border-width: 1.5px;
  border-color: black;
  border-style: solid;
  box-sizing: border-box;
  padding: 8px 2px 40px 2px;
  background-color: white;
}
</style>
