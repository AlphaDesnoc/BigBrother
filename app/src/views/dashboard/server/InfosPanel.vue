<script setup lang="ts">
</script>

<template>
    <DashboardParticles />
    <div class="dashInfos">
        <p>Server Infos</p>
        <PieChart :data="[4, 2, 5, 9, 50]" :colors="['#FF5733', '#581845', '#33482A', '#33482A', '#808B96']" :labels="['Administrateurs', 'Responsables', 'Moderateurs', 'Modo-Joueur', 'Joueurs']" :size="300" />
    </div>
</template>

<style scoped>
.dashInfos{
    position: relative;
    z-index: 1;
}
</style>