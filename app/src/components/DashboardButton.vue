<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getUserRoles, getUserState } from '../data/firebase';

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
        rank: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const isVisible = ref(true);

        const checkUserRoles = async () => {
            const user = await getUserState();
            if (user) {
                const roles = await getUserRoles(user.uid);
                isVisible.value = roles.includes(props.rank);
            }
        };

        checkUserRoles();

        return {
            isVisible
        };
    }
})
</script>

<template>
    <div class="button" v-show="isVisible">
        <i :class="icon"></i>
        {{name}}
    </div>
</template>

<style scoped>
.button {
    width: 93%;
    padding: 10px;
    color: #6B7280;
    border-radius: 3px;
    margin: 5px 0px;
    cursor: pointer;
}

.button i {
    margin-right: 10px;
}

.active,
.button:hover {
    background-color: #4F46E5;
    color: aliceblue;
}
</style>