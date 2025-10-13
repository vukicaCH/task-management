<script setup>
import Menu from 'primevue/menu';
import { EllipsisHorizontalIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useFormsStore } from '@/stores/formsStore';

const {folder} = defineProps({
    folder:{
        type: Object,
        required: true 
    }   
})

const formsStore = useFormsStore()

const setForm = (formName) => {
    formsStore.toggleForm(formName)
    formsStore.setFormFolder(folder)    
}

const menu = ref();
const addMenu = ref();

const menuItems = ref([
    {
        label: 'Folder',
        items: [
            {
                label: 'Edit',
                command: () => setForm('EditFolder')
            },
            {
                label: 'Delete',
                command: () => setForm('DeleteFolder')
            },
        ]
    }
]);

const addMenuItems = ref([
    {
        label: 'Create',
        items: [
            {
                label: 'List',
                command: () => setForm('CreateList')
            },
            {
                label: 'Document',
                command: () => {}
            }
        ]
    }
]);

const toggle = (event, isAddMenu = false) => {
    isAddMenu ? addMenu.value.toggle(event) : menu.value.toggle(event);
};

</script>

<template>
    <button @click="(e) => toggle(e)" aria-haspopup="true" aria-controls="overlay_menu" class="cursor-pointer hover:text-gray-200">
        <EllipsisHorizontalIcon class="w-5 h-5" />
    </button>

    <button @click="(e) => toggle(e, true)" aria-haspopup="true" aria-controls="overlay_add_menu" class="cursor-pointer hover:text-gray-200">
        <PlusIcon class="w-5 h-5" />
    </button>

    <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
    <Menu ref="addMenu" id="overlay_add_menu" :model="addMenuItems" :popup="true" />
</template>