<script setup>
import Menu from 'primevue/menu';
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'

const open = inject('open')

const menu = ref();

const items = ref([
    {
        label: 'List',
        items: [
            {
                label: 'Edit',
                command: () => open('Edit')
            },
            {
                label: 'Delete',
                command: () => open('Delete')
            },
            {
                label: 'Move',
                command: () => open('Move')
            }
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

</script>

<template>
    <button @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" class="cursor-pointer hover:text-gray-200">
        <EllipsisHorizontalIcon class="w-5 h-5" />
    </button>

    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>