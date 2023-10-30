import { defineStore } from "pinia";
import { ref } from "vue";

export const useSiteStore = defineStore(
  "site",
  () => {
    const signingIn = ref<boolean>(false);
    const signingUp = ref<boolean>(false);
    const editProfile = ref<boolean>(false);
    const modalVisible = ref<boolean>(false);

    const isSigningIn = (val: boolean) => (signingIn.value = val);
    const isSigningUp = (val: boolean) => (signingUp.value = val);
    const isEditingProfile = (val: boolean) => (editProfile.value = val);
    const setModalVisible = (val: boolean) => (modalVisible.value = val);
    const resetStore = () => {
      signingIn.value = false;
      signingUp.value = false;
      editProfile.value=false;
      modalVisible.value = false;
    };

    return {
        signingIn,
        signingUp,
      modalVisible,
      editProfile,
      setModalVisible,
      isSigningIn,
      isSigningUp,
      resetStore,
      isEditingProfile,
    };
  },
  { persist: true },
);
