<script setup>
import DatePicker from 'primevue/datepicker';
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef, watchEffect } from 'vue'
import dayjs from 'dayjs';
import { useTasksStore } from '@/stores/tasksStore';
import { PlusCircleIcon, LockClosedIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
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

const taskRef = toRef(() => props.task);

const isReadOnly = tasksStore.readOnlyFields.includes(props.field)

const date = ref();

const editMode = ref(false)
const canEditTask = ref(false);

const target = useTemplateRef('target')
const ignoreElSelector = '.ignore'

const getFormattedDate = (date) => dayjs(Number(date)).format('DD/MM/YYYY')

onClickOutside(
    target,
    () => {
        if(editMode.value && canEditTask.value){

            const dateUnix = dayjs(Number(date.value)).valueOf()

            tasksStore.editTask(props.task.id, {[props.field] : dateUnix})
        }

        canEditTask.value = false;
        editMode.value = false
    },
    {ignore: [ignoreElSelector]}
)

watchEffect(()=> date.value = taskRef.value[props.field])

watch(date, ()=> {
    const selectedDate = getFormattedDate(date.value)
    const taskDate = getFormattedDate(taskRef.value[props.field])

    canEditTask.value = selectedDate != taskDate
})
</script>

<template>
    <div v-if="editMode" ref="target">
        <DatePicker
            v-model="date"
            dateFormat="dd/mm/yy"
            show-button-bar
            show-icon
            :clear-button-props="{hidden: !date}"
            @clear-click="date = ''"
            placeholder="Select Date..."
            input-class="max-w-[150px]"
            :pt="{
                panel: 'ignore',
                root(obj){
                    obj.state.d_value = date ? getFormattedDate(date) : null
                }
            }"
        />
    </div>
    <div v-else @click="() => { if(!isReadOnly) editMode = true }">
        <div v-if="!isReadOnly" class="cursor-pointer">
            <div v-if="date">{{ getFormattedDate(date) }}</div>
            <div v-else v-tooltip="'Add Date'">
                <PlusCircleIcon class="w-5 h-5" />
            </div>
        </div>
        <div v-else v-tooltip="`Read Only`" class="cursor-not-allowed">
            <div v-if="date">{{ getFormattedDate(date) }}</div>
            <div v-else>
                <LockClosedIcon class="w-5 h-5 text-gray-600" />
            </div>
        </div>
    </div>
</template>