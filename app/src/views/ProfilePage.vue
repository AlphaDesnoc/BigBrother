<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCurrentUser, getProfileImage, updateUserData, updateProfileImage, activate2FA, getUserRoles } from '../data/firebase';

import router from '../router';
import { auth } from '../data/firebase';
// import { changeUserEmail } from '../data/firebase';

const user = ref();
const urlProfile = ref();
const userRoles = ref<string[]>([]);
const creationDate = ref();

onMounted(async () => {
    user.value = await getCurrentUser();
    urlProfile.value = await getProfileImage();
    if(auth.currentUser !== null){
        userRoles.value = await getUserRoles(auth.currentUser.uid);
    }
    if(auth.currentUser !== null){
    if(auth.currentUser.metadata.creationTime !== undefined){
        creationDate.value = new Date(auth.currentUser.metadata.creationTime).toLocaleDateString('FR')
    }
}
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
    if (fileImage !== null) {
        updateProfileImage(fileImage)
    }
}

// const handleClickUpdateEmail = () => {
//     if(newEmail !== null){
//         changeUserEmail(newEmail);
//     }
// }

let username: string = '';
let email: string = '';
// let newEmail: string = '';

const handleClickProfile = async () => {
    if (auth && auth.currentUser) {
        let newUsername: string | null = username || null;
        let newEmail: string | null = email || null;

        try {
            await updateUserData(newUsername, newEmail, auth.currentUser, null);
            // Mettre à jour l'état local après la modification
            user.value = { ...user.value, username: newUsername, email: newEmail };
            username = '';
        } catch (_error) {
            // alert(`Impossible : \nError Code : ${error.code}\nError Message : ${error.message}`);
        }
    }
}

const handleActivate2FA = async () => {
    activate2FA();
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
            <DashboardParticles />
            <div class="card">
                <p class="title">Profile</p>
                <span></span>
                <img :src="urlProfile" class="profilImage" />
                <p class="pseudo">{{ user.username }}</p>
                <p class="rank">{{userRoles[0]}}</p>
                <div class="infos">
                    <p class="infosName">Informations</p>
                    <div>
                        <p>Registered: {{creationDate}} </p>
                        <p>Role:</p>
                        <ul style="display: flex; justify-content: space-evenly;">
                            <li v-for="role in userRoles" :key="role">{{ role }}</li>
                        </ul>
                        <p>Two-Factor Authentication (2FA): <span>{{ user.mfa ? "Yes" : "No" }}</span></p>
                        <button id="activate2FA" @click="handleActivate2FA" v-if="!user.mfa">Activer le 2FA</button>
                        <div style="display: none;" id="captcha"></div>
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