<script setup>
import { Select } from 'primevue';
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef, watchEffect } from 'vue'
import { useTasksStore } from '@/stores/tasksStore';

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
})

const taskRef = toRef(()=> props.task)

const tasksStore = useTasksStore();

const target = useTemplateRef('target')
const ignoreElSelector = '.ignore'

const editMode = ref(false)
const canEditTask = ref(false);

const priority = ref({})

watchEffect(()=> priority.value = {...taskRef.value.priority})

const options = [
    {id: 1, priority: 'urgent', color: "#f50000", textColor: '#f2acac'},
    {id: 2, priority: 'high', color: '#f8ae00', textColor: '#f86300'},
    {id: 3, priority: 'normal', color: '#6fddff', textColor: '#6f93ff'},
    {id: 4, priority: 'low', color: '#d8d8d8', textColor: '#737373'}
]

const priorityTextAndColor = computed(() => {

    const id = priority.value?.id;

    if(id){
        return options.find(option => option.id == id)
    }else{
        return {priority: 'no priority', color: 'gray', textColor: 'white'}
    }
})

onClickOutside(
    target,
    () => {
        if(editMode.value && canEditTask.value){

            const priorityVal = priority.value?.id ?? null;

            tasksStore.editTask(props.task.id, {priority: priorityVal})
        }

        canEditTask.value = false;
        editMode.value = false
    },
    {ignore: [ignoreElSelector]}
)

watch(priority, ()=> canEditTask.value = priority.value.id != taskRef.value.priority?.id)
</script>

<template>
    <div v-if="editMode" ref="target">
        <Select
            v-model="priority"
            :options="options"
            placeholder="Select Priority..."
            showClear
            :pt="{option: 'ignore'}"
        >
            <template #value="{value, placeholder}">
                <div v-if="value" class="flex items-center">
                    <div :style="{backgroundColor: priorityTextAndColor.color , color: priorityTextAndColor.textColor}" class="py-1 px-2 !font-semibold max-w-[90px] w-auto text-sm text-center rounded-md">{{ priorityTextAndColor.priority }}</div>
                </div>
                <span v-else>
                    {{ placeholder }}
                </span>
            </template>
            <template #option="{option}">
                <div :style="{backgroundColor: option.color, color: option.textColor}" class="py-1 px-2 !font-semibold max-w-[90px] w-auto text-sm text-center rounded-md">{{ option.priority }}</div>
            </template>
        </Select>
    </div>
    <div v-else>
        <div
            @click="editMode = true"
            :style="{
                backgroundColor: priorityTextAndColor.color,
                color: priorityTextAndColor.textColor
            }"
            class="cursor-pointer py-1 px-2 !font-semibold max-w-[90px] w-auto text-sm text-center rounded-md"
        >
            {{ priorityTextAndColor.priority }}
        </div>
    </div>
</template>