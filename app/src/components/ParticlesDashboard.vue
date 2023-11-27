<script lang="ts">
import { tsParticles } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
    setup() {
        onMounted(async () => {
            await loadFull(tsParticles);

            tsParticles.load("tsparticles", {
                particles: {
                    number: {
                        value: 80, // Nombre d'étoiles
                        density: {
                            enable: true,
                            value_area: 800 // Densité des étoiles
                        }
                    },
                    color: {
                        value: "#ffffff" // Couleur des étoiles
                    },
                    shape: {
                        type: "star", // Forme des particules en étoiles
                        stroke: {
                            width: 0,
                            color: "#000000"
                        },
                        polygon: {
                            nb_sides: 5 // Nombre de côtés pour chaque étoile
                        }
                    },
                    opacity: {
                        value: 0.5, // Opacité des étoiles
                        random: true,
                        anim: {
                            enable: false,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 5, // Taille des étoiles
                        random: true,
                        anim: {
                            enable: false,
                            speed: 40,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: false
                    },
                    move: {
                        enable: true,
                        speed: 1.5, // Vitesse de déplacement des étoiles
                        direction: "none",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                retina_detect: true
            });
        });
    }
});
</script>

<template>
    <div id="tsparticles"></div>
</template>

<style>
#tsparticles {
    /* définir la taille et d'autres styles si nécessaire */
    position: absolute;
    width: 100%;
    height: 100vh;
    z-index: 0;
}
</style>