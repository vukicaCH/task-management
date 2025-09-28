<script setup>
import { useTasksStore } from '@/stores/tasksStore';
import { CalendarIcon} from '@heroicons/vue/24/outline';
import dayjs from 'dayjs';
import { Popover } from 'primevue';
import { DatePicker } from 'primevue';

const props = defineProps({
    task:{
        type: Object,
        required: true,
    }
})

const tasksStore = useTasksStore()

const op = ref();

const toggle = (event) => {
    op.value.toggle(event);
}

const startDate = ref(props.task.start_date);
const dueDate = ref(props.task.due_date);

const setDates = () => {
    const start_date = dayjs(Number(startDate.value)).valueOf()
    const due_date = dayjs(Number(dueDate.value)).valueOf()

    tasksStore.editTask(props.task.id, {start_date, due_date})
}

const getFormattedDate = (date) => dayjs(Number(date)).format('DD/MM/YYYY')

</script>

<template>
    <div class="flex items-center gap-1">
        <button @click="toggle" class="cursor-pointer rounded border border-gray-600 hover:bg-gray-700 p-1">
            <calendar-icon class="w-4 h-4" />
        </button>
        {{ getFormattedDate(startDate) }} - {{ getFormattedDate(dueDate) }}
    </div>

    <Popover ref="op" @hide="setDates">
        <div class="flex gap-1">
            <div class="flex flex-col gap-0.5">
                <span class="text-xs !font-medium">Start Date</span>
                <DatePicker
                    v-model="startDate"
                    placeholder="Select Start Date..."
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
                    :pt="{
                        root(obj){
                            obj.state.d_value = dueDate ? getFormattedDate(dueDate) : null
                        }
                    }"    
                />
            </div>
        </div>
    </Popover>
</template>