<script setup>
import { useTasksStore } from '@/stores/tasksStore';
import { CalendarIcon} from '@heroicons/vue/24/outline';
import dayjs from 'dayjs';
import { Popover } from 'primevue';
import { DatePicker } from 'primevue';
import BoardTaskDatesForDatePicker from './BoardTaskDatesForDatePicker.vue';
import { Button } from 'primevue';

const props = defineProps({
    task: {
        type: Object,
        required: true,
    }
})

const emit = defineEmits(['dates-changed'])

const tasksStore = useTasksStore()

const op = ref();

const toggle = (event) => {
    op.value.toggle(event);
}

const startDate = ref(props.task.start_date);
const dueDate = ref(props.task.due_date);

const canEdit = ref(false);

watch([startDate, dueDate], () => {

    const startDateChanged = getFormattedDate(startDate.value) !== getFormattedDate(props.task.start_date);
    const dueDateChanged = getFormattedDate(dueDate.value) !== getFormattedDate(props.task.due_date);

    canEdit.value = startDateChanged || dueDateChanged

    console.log(canEdit.value)
})

const setDates = () => {
    op.value.hide()

    if(!canEdit.value) return

    emit('dates-changed', {start_date: startDate.value, due_date: dueDate.value})

    const start_date = dayjs(Number(startDate.value)).valueOf()
    const due_date = dayjs(Number(dueDate.value)).valueOf()

    tasksStore.editTask(props.task, {start_date, due_date})
}

const getFormattedDate = (date) => dayjs(Number(date)).format('DD/MM/YYYY')

const toolTipText = computed(() => {
    if(!props.task.start_date && props.task.due_date) return 'Due Date'
    else if(props.task.start_date && !props.task.due_date) return 'Start Date'
    else if(props.task.start_date && props.task.due_date) return 'Dates'
    else if(!props.task.start_date && !props.task.due_date) return 'Due Date'
})

</script>

<template>
    <div class="flex items-center gap-1">
        <button @click="toggle" v-tooltip="`${toolTipText}`" class="cursor-pointer flex items-center gap-1 rounded border border-gray-600 hover:bg-gray-700 p-1">
            <calendar-icon class="w-4 h-4" />
            <BoardTaskDatesForDatePicker :start-date="task.start_date" :due-date="task.due_date" />
        </button>
    </div>

    <Popover ref="op">
        <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-0.5">
                <span class="text-xs !font-medium">Start Date</span>
                <DatePicker
                    v-model="startDate"
                    placeholder="Select Start Date..."
                    show-button-bar
                    :pt="{
                        root(obj){
                            obj.state.d_value = startDate ? getFormattedDate(startDate) : null
                        }
                    }"
                />
            </div>
            <div class="flex flex-col gap-0.5">
                <span class="text-xs !font-medium">Due Date</span>
                <DatePicker
                    v-model="dueDate"
                    placeholder="Select Due Date..."
                    show-button-bar
                    :pt="{
                        root(obj){
                            obj.state.d_value = dueDate ? getFormattedDate(dueDate) : null
                        }
                    }"    
                />
            </div>

            <Button @click="setDates">Save</Button>
        </div>
    </Popover>
</template>