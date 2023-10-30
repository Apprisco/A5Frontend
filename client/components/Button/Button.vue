<script setup lang="ts">
import { defineProps, ref, toRefs } from "vue";
const props = defineProps<
{
  onClick:() => void;
  text: string;
  width?: string;
  height?: string;
  isDisabled?: boolean;
  variant?: "important" | "normal";
  selected?: boolean;
}>();

const { onClick, text, width, height, isDisabled, variant, selected } = toRefs(props);
const defaultWidth = "100px";
const defaultHeight = "50px";
const actualWidth = ref<string>(width?.value ?? defaultWidth);
const actualHeight = ref<string>(height?.value ?? defaultHeight);

const executeAction = () => {
  if (isDisabled.value) return;
  onClick.value();
};
</script>

<template>
  <div class="button-container" :class="{ disabled: isDisabled, important: variant === 'important', normal: variant === 'normal' || !variant, selected: selected }" v-on:click="executeAction">
    <h1 class="text bold small-text">{{text}}</h1>
  </div>
</template>

<style scoped>
.button-container{
  align-items: center;
  justify-content: center;
  display: flex;
  min-width: v-bind(actualWidth);
  max-width: v-bind(actualWidth);
  min-height: v-bind(actualHeight);
  max-height: v-bind(actualHeight);
  padding: 2px;
  border-width: 0.5px;
  border-radius: 12px;
  border-style: solid;
}
.button-container:hover {
  cursor: pointer;
}
.important {
  background-color: var(--light-blue);
}
.important:hover {
  background-color: var(--dark-purple);
}
.important:active {
  background-color: var(--darker-purple);
}
.normal {
  background-color: white;
}
.normal:hover {
  background-color: rgb(220, 220, 220);
}
.normal:active {
  background-color: rgb(180, 180, 200180);
}
.disabled {
  background-color: var(--disabled-color);
}
.disabled:hover {
  background-color: var(--disabled-color);
  cursor: initial;
}
.disabled:active {
  background-color: var(--disabled-color);
}
.selected {
  background-color: var(--cyan);
}
.selected:hover {
  background-color: var(--cyan);
}
.selected:active {
  background-color: var(--cyan);
}
.text {
  margin: 0px;
  user-select: none;
  text-align: center;
}
</style>