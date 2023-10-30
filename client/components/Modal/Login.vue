<script setup lang="ts">
import router from "@/router";
import { useSiteStore } from "@/stores/site";
import { useUserStore } from "@/stores/user";
import { computed, ref } from "vue";
import Button from "../Button/Button.vue";

const username = ref("");
const password = ref("");
const { loginUser, updateSession } = useUserStore();
const { isSigningUp, isSigningIn } = useSiteStore();

async function login() {
  await loginUser(username.value,password.value);
  await updateSession();
  isSigningIn(false);
  isSigningUp(false);
  router.push({name:"Profile"});
}
const routeTo = (name: string) => {
  router.push({ name });
};

function goBack() {
  isSigningIn(false);
  isSigningUp(false);
}

const isDisabled = computed(() => ![username, password].every((ref) => ref.value.length > 0));
</script>

<template>
  <div class="modal-container" @click.native="goBack">
    <div class="content" v-on:click.native.stop>
      <h1 class="large-text">Login</h1>
      <div class="column">
        <input v-model.trim="username" type="text" class="textField" id="aligned-name" placeholder="Username" required />
        <input type="password" v-model.trim="password" class="textField" id="aligned-password" placeholder="Password" required />
      </div>
      <Button :text="'Login'" :width="'180px'" :onClick="login" :isDisabled="isDisabled" :variant="'important'" />
    </div>
  </div>
</template>

<style scoped>
.content {
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