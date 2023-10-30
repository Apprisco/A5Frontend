import { defineStore } from "pinia";
import { ref } from "vue";

export const useSiteStore = defineStore(
  "site",
  () => {
    const signingIn = ref<boolean>(false);
    const signingUp = ref<boolean>(false);
    const modalVisible = ref<boolean>(false);

    const isSigningIn = (val: boolean) => (signingIn.value = val);
    const isSigningUp = (val: boolean) => (signingUp.value = val);
    const setModalVisible = (val: boolean) => (modalVisible.value = val);
    const resetStore = () => {
      signingIn.value = false;
      signingUp.value = false;
      modalVisible.value = false;
    };

    return {
        signingIn,
        signingUp,
      modalVisible,
      setModalVisible,
      isSigningIn,
      isSigningUp,
      resetStore,
    };
  },
  { persist: true },
);
