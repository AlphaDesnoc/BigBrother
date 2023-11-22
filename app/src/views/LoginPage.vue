<script setup lang="ts">
import { authentication } from '../data/firebase';
import router from '../router';
import { onMounted } from 'vue';
import { show_hide_password } from '../utils/methods';

let emailText: string = '';
let passwordText: string = '';

onMounted(() => {

});
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
          <form @submit.prevent="authentication(emailText, passwordText)"> <!--Auth Function -->
            <div class="inputBx">
              <input type="email" v-model="emailText" required>
              <span>Email</span>
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="inputBx password">
              <input id="password-input" type="password" name="password" v-model="passwordText" required>
              <span>Password</span>
              <a href="#" id="password-control" class="password-control" @click="show_hide_password()"></a>
              <i class="fas fa-key"></i>
            </div>
            <div class="inputBx">
              <input type="submit" value="Log In">
            </div>
            <div style="display: none;" id="recaptcha-container-id"></div>
            <p class="createAccount">Pas de compte ? <span class="createAccount" @click="router.push('/register')">Créer
                un compte</span></p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>