<script setup lang="ts">
// Todo : Remettre le code (Bloque la console)
// export default {
//   mounted() {
//     document.addEventListener('keydown', this.blockF12);
//     document.addEventListener('contextmenu', this.blockRightClick);
//   },
//   beforeDestroy() {
//     document.removeEventListener('keydown', this.blockF12);
//     document.removeEventListener('contextmenu', this.blockRightClick);
//   },
//   methods: {
//     blockF12(event: KeyboardEvent) {
//       if (event.code === 'F12') { // 123 est le code de la touche F12
//         event.preventDefault();
//         alert("F12 a été désactivé.");
//       }
//     },
//     blockRightClick(event: MouseEvent) {
//       event.preventDefault();
//       alert("Le clic droit a été désactivé.");
//     }
//   }
// };
</script>

<template>
  <router-view />
</template>