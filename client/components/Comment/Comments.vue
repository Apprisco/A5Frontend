<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import DeleteComment from "./DeleteComment.vue";
import CreateComment from "./CreateComment.vue";

const props = defineProps(["post"]);
const comments = ref({ comments: [], is_expand: false });
const load = ref(false);
const { isLoggedIn } = storeToRefs(useUserStore());
const write = ref(false);

async function getComments() {
  let results;
  try {
    results = await fetchy(`/api/comments/${props.post._id}`, "GET");
  } catch {
    return;
  }
  comments.value.comments = results;
}

async function togglewrite() {
  write.value = !write.value;
}

onBeforeMount(async () => {
  await getComments();
  load.value = true;
});
</script>

<template>
  <div class="comments">
    <section v-if="load && comments.comments.length !== 0">
      <button class="btn-small pure-button" @click="togglewrite">{{ comments.comments.length }} comments</button>
      <article v-for="comment in comments.comments" class="min-item" v-show="write" :key="comment">
        <DeleteComment :comment="comment" @refresh="getComments" />
      </article>
    </section>
    <p v-else-if="load"><button class="btn-small pure-button" @click="togglewrite">Write a comment</button></p>
    <p v-else>loading...</p>
    <section v-if="isLoggedIn">
      <div v-if="write">
        <CreateComment :post="props.post" @refresh="getComments" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.pure-button {
  background-color: var(--light-blue);
  border-radius: 8px;
}
.min-item {
  display: flex;
}

</style>
