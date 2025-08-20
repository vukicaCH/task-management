<script setup>
import Menu from 'primevue/menu';
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
import { useFormsStore } from '@/stores/formsStore';
import { useSpaceStore } from '@/stores/spaceStore';

const props = defineProps({
    list:{
        type: Object,
        required: true,
    },
})

const formsStore = useFormsStore()
const spaceStore = useSpaceStore()

const menu = ref();

const items = ref([
    {
        label: 'List',
        items: [
            {
                label: 'Edit',
                command: () => formsStore.toggleForm('EditList')
            },
            {
                label: 'Delete',
                command: () => formsStore.toggleForm('DeleteList')
            }
        ]
    }
]);

const toggle = (event) => {
    spaceStore.setCurrentList(props.list)
    menu.value.toggle(event);
};

</script>

<template>
    <button @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
        <EllipsisHorizontalIcon class="w-5 h-5" />
    </button>

    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>