<script setup>
import Menu from 'primevue/menu';
import { PlusIcon } from '@heroicons/vue/24/outline'

const open = inject('open')

const menu = ref();

const items = ref([
    {
        label: 'Add',
        items: [
            {
                label: 'List',
                command: () => open('Create')
            },
            {
                label: 'Document',
                command: () => {}
            }
        ]
    }
]);

const toggle = (event) => menu.value.toggle(event)

</script>

<template>

    <button @click="(e) => toggle(e)" aria-haspopup="true" aria-controls="overlay_menu">
        <span class="flex items-center gap-2 cursor-pointer text-sm"><PlusIcon class="w-4 h-4" /> Add Item</span>
    </button>

    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>