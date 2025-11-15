import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist((set) => ({
    currentUser: null,
    profileImage: 1,
    setCurrentUser: (newUser) => set({ currentUser: newUser }),
    removeCurrentUser: () => set({ currentUser: null }),
    updateCurrentUser: (updatedUser) => set({ currentUser: updatedUser }),
    setProfileImage: (newImage) => set({ profileImage: newImage }),
    updateProfileImage: (updatedImage) => set({ profileImage: updatedImage }),
  }))
);

export default useAuthStore;