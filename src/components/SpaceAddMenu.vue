<script setup>
import Menu from 'primevue/menu';
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useFormsStore } from '@/stores/formsStore';

const {space} = defineProps({
    space:{
        type: Object,
        required: true 
    }   
})

const formsStore = useFormsStore()

const setForm = (formName) => {
    formsStore.toggleForm(formName)
    formsStore.setFormSpace(space)    
}

const menu = ref();

const items = ref([
    {
        label: 'Add',
        items: [
            {
                label: 'Folder',
                command: () => setForm('CreateFolder')
            },
            {
                label: 'List',
                command: () => setForm('CreateList')
            }
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

</script>

<template>
    <button @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
        <span class="flex items-center gap-2 cursor-pointer text-sm"><PlusIcon class="w-4 h-4" /> Add Item</span>
    </button>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>