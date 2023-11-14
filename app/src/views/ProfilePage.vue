<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCurrentUser, getProfileImage, setProfileImage, setUserData, auth } from '../data/firebase';

import router from '../router';

const user = ref();
const urlProfile = ref();

onMounted(async () => {
  user.value = await getCurrentUser();
  urlProfile.value = await getProfileImage();
});

let fileImage: File | null;
const fileName = ref();

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    fileImage = target.files ? target.files[0] : null;
    if (fileImage !== null) {
        fileName.value = fileImage.name;
    }
};

const handleClickUpdateImage = () => {
    if(fileImage !== null) {
        setProfileImage(fileImage)
    }
}

let username: string = '';
let email: string = '';

const handleClickProfile = () => {
    if (auth !== null && auth.currentUser !== null) {
        setUserData(null, null, username, email, auth.currentUser)
        .then(() => {})
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Impossible : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
        })
    }
}

</script>

<template>
    <div class="backProfile">
        <div class="topBar">
            <div class="backToDash" @click="router.push('dashboard')">
                <input type="submit" value="Dashboard">
                <i class="fas fa-solid fa-arrow-left"></i>
            </div>
        </div>
        <div class="panelProfile" v-if="user && urlProfile">
            <div class="card">
                <p class="title">Profile</p>
                <span></span>
                <img :src="urlProfile" class="profilImage"/>
                <p class="pseudo">{{ user.username }}</p>
                <p class="rank">Owner</p>
                <div class="infos">
                    <p class="infosName">Informations</p>
                    <div>
                        <p>Registered: </p>
                        <p>Two-Factor Authentication (2FA): <span>No</span></p>
                    </div>
                </div>
            </div>
            <div class="card">
                <p class="title">Users Infos</p>
                <span></span>
                <div class="datas">
                    <div class="inputBxProfile">
                        <input type="text" v-model="username" placeholder="Username">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="inputBxProfile">
                        <input type="text" v-model="email" placeholder="Email">
                        <i class="fas fa-solid fa-at"></i>
                    </div>
                    <div class="inputBxProfile">
                        <button @click="handleClickProfile">Update</button>
                    </div>
                </div>
            </div>
            <div class="card">
                <p class="title">Profile Image</p>
                <span></span>
                <div class="datas">
                    <div class="inputBxProfile">
                        <label for="imageSelector" class="imageSelector">
                            Choisir une photo de profil...
                        </label>
                        <input type="file" id="imageSelector" @change="handleFileUpload" accept=".jpg, .png" required>
                        <i class="fas-fa fa-regular fa-file-image"></i>
                        <p class="imageName">{{ fileName }}</p>
                    </div>
                    <div class="inputBxProfile">
                        <button @click="handleClickUpdateImage">Update</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>