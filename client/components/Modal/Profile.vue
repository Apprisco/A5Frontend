<script setup lang="ts">
import router from "@/router";
import { useSiteStore } from "@/stores/site";
import { useUserStore } from "@/stores/user";
import { computed, ref } from "vue";
import Button from "../Button/Button.vue";
import { fetchy } from "@/utils/fetchy";

const introduction = ref("");
const name = ref("");
const captions = ref(true);
const speech = ref(true);
const { updateSession } = useUserStore();
const { isEditingProfile } = useSiteStore();
const fetchProfile = async () => {
  let profile;
  try {
    profile= await fetchy(`/api/profiles`, "GET",{});
  } catch {
    return;
  }
  return profile;
};
async function edit() {
  isEditingProfile(false);
  try {
    await fetchy(`api/profiles`, "PATCH", { body: { update: { content: introduction.value,name:name.value,captions:captions.value,speech:speech.value} } });
  } catch {
    return;
  }
  router.push({name:"Profile"});
  router.go(0);
}
const routeTo = (name: string) => {
  router.push({ name });
};

function goBack() {
  isEditingProfile(false);
}
let profile=await fetchProfile();
introduction.value=profile.content;
name.value=profile.name;
captions.value=profile.captions;
speech.value=profile.speech;

</script>

<template>
  <div class="modal-container" @click.native="goBack">
    <div class="content" v-on:click.native.stop>
      <h1 class="large-text">Update Profile</h1>
      <div class="column">
        <p>Name: <input v-model.trim="name" type="text" class="textField" id="aligned-name" placeholder="Name" required /></p>
        <p>Introduction: <input v-model.trim="introduction" type="text" class="textField" id="aligned-name" placeholder="Introduction" required /></p>
        <p>Captions: <input v-model.trim="captions" class="checkbox" type='checkbox' required /></p>
        <p>Speech: <input v-model.trim="speech" class="checkbox" type='checkbox' required /></p>
      </div>
      <Button :text="'Update'" :width="'180px'" :onClick="edit" :variant="'important'" />
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