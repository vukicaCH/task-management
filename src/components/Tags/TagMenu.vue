<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { useTasksStore } from '@/stores/tasksStore';
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    tag:{
        type: Object,
        required: true,
    }
})

const tasksStore = useTasksStore();
const formsStore = useFormsStore();

const openTagEditor = inject('open-tag-editor')

</script>

<template>
    <div class="w-full flex justify-center gap-2">
        <button @click="(e) => openTagEditor(e, tag)">
            <EllipsisHorizontalIcon class="w-5 h-5 hover:text-gray-400" />
        </button>
        <button @click="() => tasksStore.removeTag(formsStore.task.id, tag)">
            <XMarkIcon class="w-5 h-5 hover:text-gray-400" />
        </button>
    </div>
</template>