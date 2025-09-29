<script setup>
import dayjs from 'dayjs';

const props = defineProps({
    startDate: {
        required: true,
        default: null
    },

    dueDate: {
        required: true,
        default: null
    },
})

const getFormattedDate = (date) => dayjs(Number(date)).format('DD/MM/YYYY')
</script>

<template>
    <div v-if="startDate || dueDate" class="text-[11px]">
        <span v-if="startDate && !dueDate">Starts {{ getFormattedDate(startDate) }}</span>
        <span v-else-if="!startDate && dueDate">Due {{ getFormattedDate(dueDate) }}</span>
        <span v-else-if="startDate && dueDate">{{ getFormattedDate(startDate) }} - {{ getFormattedDate(dueDate) }}</span>
    </div>
</template>