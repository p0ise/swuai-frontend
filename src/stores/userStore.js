// stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null
  }),
  getters: {
    isLoggedIn: (state) => !!state.user
  },
  actions: {
    login(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    }
  }
});
