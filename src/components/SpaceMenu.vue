<script setup>
import Menu from 'primevue/menu';
import { EllipsisHorizontalIcon, PlusIcon } from '@heroicons/vue/24/outline'

const open = inject('open')

const menu = ref();
const addMenu = ref();

const menuItems = ref([
    {
        label: 'Space',
        items: [
            {
                label: 'Edit',
                command: () => open('Edit')
            },
            {
                label: 'Delete',
                command: () => open('Delete')
            }
        ]
    }
]);

const addMenuItems = ref([
    {
        label: 'Add',
        items: [
            {
                label: 'Folder',
                command: () => open('CreateFolder')
            },
            {
                label: 'List',
                command: () => open('CreateList')
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