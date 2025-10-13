<script setup>
import Menu from 'primevue/menu';
import { PlusIcon } from '@heroicons/vue/24/outline'
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

const items = ref([
    {
        label: 'Add',
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

const toggle = (event) => menu.value.toggle(event)

</script>

<template>

    <button @click="(e) => toggle(e)" aria-haspopup="true" aria-controls="overlay_menu">
        <span class="flex items-center gap-2 cursor-pointer text-sm"><PlusIcon class="w-4 h-4" /> Add Item</span>
    </button>

    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>