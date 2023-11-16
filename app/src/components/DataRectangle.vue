<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        data: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        width: {
            type: String,
            required: true
        },
        height: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: false
        }
    },
    setup(_props) {},
})
</script>

<template>
    <div class="back">
        <i :class="icon"></i>
        <div>
            <h1><span>{{ data }}</span></h1>
            <h3>{{ label }}</h3>
        </div>
    </div>
</template>

<style scoped>

.back {
    background-color: v-bind(color);
    width: v-bind(width);
    height: v-bind(height);
    padding: 15px;
    border: 1.5px solid #374151;
    border-radius: 10px;
}

</style>