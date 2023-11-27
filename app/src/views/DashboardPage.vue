<script setup lang="ts">
import router from '../router';
import { getCurrentUser, logOut, getProfileImage } from '../data/firebase';
import { ref, onMounted } from 'vue';

let activeButtonIndex = ref();

const user = ref();
const urlProfile = ref();

onMounted(async () => {
  user.value = await getCurrentUser();
  urlProfile.value = await getProfileImage();
});

function handleClick(route: string, index: number){
  router.push('/dashboard/' + route);
  activeButtonIndex.value = index;
}
</script>

<template>
  <div class="back">
    <div class="bar">
      <div class="barMenu">
        <div class="titleContainer">
          <img class="titleImage" src="/bigbrother.png"/>
          <h2 class="title">BigBrother</h2>
        </div>
        <p class="category">Server</p>
        <DashboardButton :name="'Dashboard'" :icon="'fa-solid fa-gauge'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 0 }" @click="handleClick('server/infos', 0)" />
        <DashboardButton :name="'Console'" :icon="'fa-solid fa-terminal'" :rank="'Administrateur'" :class="{ active: activeButtonIndex === 1 }" @click="handleClick('server/console', 1)" />
        <DashboardButton :name="'Users'" :icon="'fa-solid fa-users'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 2 }" @click="handleClick('server/users', 2)" />
        <p class="category">Website</p>
        <DashboardButton :name="'Dashboard'" :icon="'fa-solid fa-gauge'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 3 }" @click="handleClick('web/infos', 3)" />
        <DashboardButton :name="'Users'" :icon="'fa-solid fa-users'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 4 }" @click="handleClick('web/users', 4)" />
        <p class="category">Discord</p>
        <DashboardButton :name="'Dashboard'" :icon="'fa-solid fa-gauge'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 5 }" @click="handleClick('discord/infos', 5)" />
        <DashboardButton :name="'Users'" :icon="'fa-solid fa-users'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 6 }" @click="handleClick('discord/users', 6)" />
        <p class="category">Admin</p>
        <DashboardButton :name="'Users'" :icon="'fa-solid fa-users'" :rank="'Administrateur'" :class="{ active: activeButtonIndex === 7 }" @click="handleClick('admin/users', 7)" />
      </div>
      <div class="barBottom">
        <div class="button logout" @click="logOut">
          <i class="fa-solid fa-right-to-bracket"></i>
          Log Out
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="top">
        <div class="searchBox">
          <input type="text" placeholder="Recherche...">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 50 50" class="fas iconify iconify--ei"><path fill="currentColor" d="M23 36c-7.2 0-13-5.8-13-13s5.8-13 13-13s13 5.8 13 13s-5.8 13-13 13zm0-24c-6.1 0-11 4.9-11 11s4.9 11 11 11s11-4.9 11-11s-4.9-11-11-11z"></path><path fill="currentColor" d="m32.682 31.267l8.98 8.98l-1.414 1.414l-8.98-8.98z"></path></svg>
        </div>
        <div class="profile" v-if="user && urlProfile" @click="router.replace('/profile')">
            <img :src="urlProfile" class="profileImage" />
            <p>Bonjour, <span>{{ user.username }}</span></p>
        </div>
      </div>
      <div class="bottom">
        <router-view />
      </div>
    </div>
  </div>
</template>