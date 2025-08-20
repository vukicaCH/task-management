<script setup>
import Menu from 'primevue/menu';
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useFormsStore } from '@/stores/formsStore';
import { useSpaceStore } from '@/stores/spaceStore';

const props = defineProps({
    space:{
        type:Object,
        required: true,
    }
})

const formsStore = useFormsStore()
const spaceStore = useSpaceStore()

const menu = ref();

const items = ref([
    {
        label: 'Add',
        items: [
            {
                label: 'Folder',
                command: () => formsStore.toggleForm('CreateFolder')
            },
            {
                label: 'List',
                command: () => formsStore.toggleForm('CreateFolderlessList')
            }
        ]
    }
]);

const toggle = (event) => {
    spaceStore.currentSpace = props.space;
    menu.value.toggle(event);
};

</script>

<template>
    <button @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"><PlusIcon class="w-5 h-5" /></button>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>