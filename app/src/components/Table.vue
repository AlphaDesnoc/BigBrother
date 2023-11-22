<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
    props: {
        data: {
            type: Array as () => string[],
            required: true
        },
        label: {
            type: Array as () => string[],
            required: true
        },
        buttons: {
            type: Array as () => Array<{
                text: string,
                class: string,
                onClick: Function
            }>,
            default: () => []
        }
    },
    setup(props) {
        const columnWidth = computed(() => {
            const totalColumns = props.label.length + (props.buttons.length > 0 ? 1 : 0);
            return `${100 / totalColumns}%`;
        });

        function calculateRowHeight(item: any) {
            const baseHeight = 40; // Hauteur de base pour une ligne
            const heightPerItem = 10; // Hauteur supplémentaire par élément

            // Calcule le nombre d'éléments dans l'objet
            const itemCount = Object.keys(item).length;

            // Calcule la hauteur totale
            return baseHeight + (itemCount * heightPerItem);
        }

        return { columnWidth, calculateRowHeight};
    },
})
</script>

<template>
    <div class="back">
        <table>
            <thead>
                <th v-for="title in label" :key="title">{{ title }}</th>
            </thead>
            <tbody>
                <tr v-for="(item, index) in data" :key="index" :style="{ height: calculateRowHeight(item) + 'px'}">
                    <td v-for="(value, key) in item" :key="key">{{ value }}</td>
                    <td v-if="buttons.length">
                        <button v-for="(button, btnIndex) in buttons" 
                                :key="btnIndex" 
                                :class="button.class" 
                                @click="() => button.onClick(item)">
                            {{ button.text }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.back{
    background-color: #1F2937;
    width: 90%;
    height: 90%;
    overflow: hidden;
    border: 2px solid #374151;
    border-radius: 10px;
}
table{
    width: 100%;
}
thead{
    height: 10%;
}
th{
    text-align: center;
    width: v-bind(columnWidth);
    border-bottom: 2px solid #374151;
}
tr{
    text-align: center;
}
td{
    border-bottom: 2px solid #374151;
}
</style>