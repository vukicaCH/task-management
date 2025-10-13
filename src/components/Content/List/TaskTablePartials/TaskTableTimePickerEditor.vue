<script setup>
import DatePicker from 'primevue/datepicker';
import { watchEffect } from 'vue'
import dayjs from 'dayjs';
import { useTasksStore } from '@/stores/tasksStore';
import { LockClosedIcon } from '@heroicons/vue/24/outline';

const {task, field} = defineProps({
    task:{
        type: Object,
        required: true,
    },

    field:{
        type: String,
        required: true
    }
})

const tasksStore = useTasksStore()

const taskRef = toRef(() => task);

const isReadOnly = tasksStore.readOnlyFields.includes(field)

const date = ref();

const canEditTask = ref(false);

const getFormattedDate = (date) => dayjs(Number(date)).format('DD/MM/YYYY')

const editDate = () => {
    if(canEditTask.value){
        const dateUnix = dayjs(Number(date.value)).valueOf()
        tasksStore.editTask(task, {[field] : dateUnix})
    }

    tasksStore.listEditMode = false;
    canEditTask.value = false;
}

watchEffect(()=> date.value = taskRef.value[field])

watch(date, ()=> {
    const selectedDate = getFormattedDate(date.value)
    const taskDate = getFormattedDate(taskRef.value[field])

    canEditTask.value = selectedDate != taskDate
})
</script>

<template>
    <DatePicker
        v-if="!isReadOnly"
        v-model="date"
        dateFormat="dd/mm/yy"
        show-button-bar
        show-icon
        :clear-button-props="{hidden: !date}"
        @clear-click="date = ''"
        :placeholder="isReadOnly ? 'Read Only' : 'Select Date...'"
        input-class="max-w-[150px]"
        :disabled="isReadOnly"
        @focus="tasksStore.listEditMode = true"
        @blur="editDate"
        :pt="{
            panel: 'ignore',
            root(obj){
                obj.state.d_value = date ? getFormattedDate(date) : null
            }
        }"
    />
    <div v-else v-tooltip="`Read Only`" class="cursor-not-allowed flex items-center gap-1 text-gray-400">
        <div>
            <div v-if="date">{{ getFormattedDate(date) }}</div>
            <div v-else>No Date</div>
        </div>
        <LockClosedIcon class="w-5 h-5" />
    </div>
</template>