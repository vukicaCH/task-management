<script setup>
import Menu from 'primevue/menu';
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
import { useFormsStore } from '@/stores/formsStore';
import { useSpaceStore } from '@/stores/spaceStore';

const props = defineProps({
    folder:{
        type:Object,
        required: true,
    }
})

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const menu = ref();

const items = ref([
    {
        label: 'Folder',
        items: [
            {
                label: 'Edit',
                command: () => formsStore.toggleForm('EditFolder')
            },
            {
                label: 'Delete',
                command: () => formsStore.toggleForm('DeleteFolder') 
            }
        ]
    }
]);

const toggle = (event) => {
    spaceStore.setCurrentFolder(props.folder)
    menu.value.toggle(event);
};

</script>

<template>
    <button @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"><EllipsisHorizontalIcon class="w-5 h-5" /></button>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>