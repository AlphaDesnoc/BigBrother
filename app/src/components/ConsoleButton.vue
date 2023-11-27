<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true
        },
        icon: {
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
        }
    },
    setup(_props) {
    }
})
</script>

<template>
    <div class="button">
        <i :class="icon"></i>
        {{name}}
    </div>
</template>

<style scoped>
.button {
    width: v-bind(width);
    height: v-bind(height);
    padding: 10px;
    background-color: v-bind(color);
    color: white;
    border-radius: 3px;
    margin: 5px 0px;
    cursor: pointer;
}

.button i {
    margin-right: 10px;
}
</style>