<script lang="ts">
import { tsParticles } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
    setup() {
        onMounted(async () => {
            await loadFull(tsParticles);

            tsParticles.load('tsparticles', {
                preset: 'triangles',
                particles: {
                    number: {
                        value: 100,
                    },
                    links: {
                        distance: 150,
                        enable: true,
                        triangles: {
                            enable: true,
                            opacity: 0.05,
                        },
                    },
                    move: {
                        enable: true,
                        speed: 1,
                    },
                    size: {
                        value: 1,
                    },
                    shape: {
                        type: "circle",
                    },
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onHover: {
                            enable: true,
                            mode: "parallax"
                        },
                        onClick: {
                            enable: true,
                            mode: "push"
                        },
                        resize: true
                    },
                    modes: {
                        parallax: {
                            force: 60, // Force de l'effet Parallax
                            smooth: 20 // Lissage de l'effet
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
}
</style>