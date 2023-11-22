<script setup lang="ts">
    import { ref } from 'vue';
    import { createAccount } from '../data/firebase';
    import { show_hide_password } from '../utils/methods';
    const firstNameText: string = '';
    const surnameText: string = '';
    const usernameText: string = '';
    const emailText: string = '';
    const passwordText: string = '';
    let fileImage: File | null;
    const fileName = ref();

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      fileImage = target.files ? target.files[0] : null;
      if (fileImage !== null) {
        fileName.value = fileImage.name;
      }
    };

</script>

<template>
    <section>
    <Particles />
    <div class="box">
      
      <div class="square" style="--i:0;"></div>
      <div class="square" style="--i:1;"></div>
      <div class="square" style="--i:2;"></div>
      <div class="square" style="--i:3;"></div>
      <div class="square" style="--i:4;"></div>
      <div class="square" style="--i:5;"></div>
      
    <div class="containerLogin"> 
      <div class="form"> 
        <h2>BigBrother</h2>
        <form @submit.prevent="createAccount(firstNameText, surnameText, usernameText, emailText, passwordText, fileImage)">
          <div class="inputBx">
            <input type="text" v-model="firstNameText" required>
            <span>First Name</span>
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="inputBx">
            <input type="text" v-model="surnameText" required>
            <span>Surname</span>
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="inputBx">
            <input type="text" v-model="usernameText" required>
            <span>Username</span>
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="inputBx">
            <input type="email" v-model="emailText" required>
            <span>Email</span>
            <i class="fas fa-solid fa-at"></i>
          </div>
          <div class="inputBx password">
            <input id="password-input" type="password" name="password" v-model="passwordText" required>
            <span>Password</span>
            <a href="#" id="password-control" class="password-control" @click="show_hide_password()"></a>
            <i class="fas fa-key"></i>
          </div>
          <div class="inputBx">
            <label for="imageSelector" class="imageSelector">
              Choisir une photo de profil...
            </label>
            <input type="file" id="imageSelector" @change="handleFileUpload" accept=".jpg, .png" required>
            <i class="fas fa-regular fa-file-image"></i>
            <p class="imageName">{{ fileName }}</p>
          </div>
          <div class="inputBx">
            <input type="submit" value="Register"> 
          </div>
        </form>
      </div>
    </div>
    </div>
  </section>
</template>