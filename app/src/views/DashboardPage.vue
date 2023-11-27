<script setup lang="ts">
import router from '../router';
import { getCurrentUser, logOut, getProfileImage } from '../data/firebase';
import { ref, onMounted, onUnmounted } from 'vue';

let activeButtonIndex = ref();

const user = ref();
const urlProfile = ref();
const windowWidth = ref(window.innerWidth);
const isVisible = ref(true);

onMounted(async () => {
  user.value = await getCurrentUser();
  urlProfile.value = await getProfileImage();

  window.addEventListener('resize', updateWindowWidth);
});

onUnmounted(async () => {
  window.removeEventListener('resize', updateWindowWidth);
});

function handleClick(route: string, index: number){
  router.push('/dashboard/' + route);
  activeButtonIndex.value = index;
}

const updateWindowWidth = (): void => {
  windowWidth.value = window.innerWidth;
};

const getNameByTabletSize = (name: string): string => {
  return windowWidth.value >= 1024 ? name : '';
};

const getNameByPhoneSize = (name: string): string => {
  return windowWidth.value >= 768 ? name : '';
};

function modifyBarVisibility() {
  return isVisible.value = !isVisible.value;
}

</script>

<template>
  <div class="back">
    <div class="bar" v-show="isVisible">
      <div class="barMenu">
        <div class="titleContainer">
          <img class='titleImage' src="/bigbrother.png"/>
          <h2 class="title">{{ getNameByPhoneSize('BigBrother') }}</h2>
        </div>
        <p class='category'>Server</p>
        <DashboardButton :name="getNameByTabletSize('Dashboard')" :icon="'fa-solid fa-gauge'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 0 }" @click="handleClick('server/infos', 0)" />
        <DashboardButton :name="getNameByTabletSize('Console')" :icon="'fa-solid fa-terminal'" :rank="'Administrateur'" :class="{ active: activeButtonIndex === 1 }" @click="handleClick('server/console', 1)" />
        <DashboardButton :name="getNameByTabletSize('Users')" :icon="'fa-solid fa-users'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 2 }" @click="handleClick('server/users', 2)" />
        <p class='category'>Website</p>
        <DashboardButton :name="getNameByTabletSize('Dashboard')" :icon="'fa-solid fa-gauge'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 3 }" @click="handleClick('web/infos', 3)" />
        <DashboardButton :name="getNameByTabletSize('Users')" :icon="'fa-solid fa-users'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 4 }" @click="handleClick('web/users', 4)" />
        <p class="category">Discord</p>
        <DashboardButton :name="getNameByTabletSize('Dashboard')" :icon="'fa-solid fa-gauge'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 5 }" @click="handleClick('discord/infos', 5)" />
        <DashboardButton :name="getNameByTabletSize('Users')" :icon="'fa-solid fa-users'" :rank="'Modérateur'" :class="{ active: activeButtonIndex === 6 }" @click="handleClick('discord/users', 6)" />
      </div>
      <div class="barBottom">
        <div class="button logout" @click="logOut">
          <i class="fa-solid fa-right-to-bracket"></i>
          {{getNameByPhoneSize('Log Out')}}
        </div>
      </div>
    </div>
    <div :class="['panel', { expanded: isVisible }]">
      <div class="top">
        <div>
          <button class="sidebarButton" @click="_$event => modifyBarVisibility()">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
        <div :class="['profile', { expanded: isVisible }]" v-if="user && urlProfile" @click="router.replace('/profile')">
            <img :src="urlProfile" class="profileImage" />
            <p>{{getNameByPhoneSize(`Bonjour, ${user.username}`)}}</p>
        </div>
      </div>
      <div class="bottom">
        <router-view />
      </div>
    </div>
  </div>
</template>