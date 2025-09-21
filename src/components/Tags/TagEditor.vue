<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { onUnmounted, onMounted } from 'vue';

const emit = defineEmits(['delete', 'edit'])

const formsStore = useFormsStore();

const tagToBeEdited = ref({...formsStore.tag})

const canSave = ref(false);

watch(() => tagToBeEdited.value.name, (oldVal, newVal) => {
    if(oldVal !== newVal && newVal.length) canSave.value = true;
})

const text = ref();

const handleDeleteClick = () => {
    canSave.value = false;
    emit('delete')
}

onMounted(()=> text.value.focus())

onUnmounted(() => {
    if(canSave.value) emit('edit', tagToBeEdited.value)
})
</script>

<template>
    <div>
        <div class="pb-0.25 border-b">
            <input
                ref="text"
                class="focus:ring-0 focus:outline-none"
                v-model="tagToBeEdited.name"
            />
        </div>
        <div class="!mt-2">
            <button
                class="border text-red-200 !font-medium rounded-md w-full hover:text-red-300 flex gap-1 items-center justify-center"
                @click="handleDeleteClick"
            >
                Delete
                <TrashIcon class="w-4 h-4" />
            </button>
        </div>
    </div>
</template>