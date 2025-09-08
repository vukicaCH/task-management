<script setup>
import { Select } from 'primevue';
import { useSpaceStore } from '@/stores/spaceStore';

const props = defineProps({
    task:{
        type: Object,
        required: true,
    },
})

const status = defineModel('status')

const spaceStore = useSpaceStore();

const taskSpace = computed(() => spaceStore.spaces.find(space => space.id === props.task.space.id));

const options = computed(() => taskSpace.value.statuses)
</script>

<template>
    <Select
        v-model="status"
        :options="options"
        option-label="status"
    />
</template>