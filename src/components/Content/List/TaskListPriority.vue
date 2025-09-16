<script setup>
import { Select } from 'primevue';

const props = defineProps({
    editMode:{
        type: Boolean,
        required: false,
        default: false
    }
})

const priority = defineModel('priority');

const options = [
    {id: 1, priority: 'urgent', color: "#f50000", textColor: '#f2acac'},
    {id: 2, priority: 'high', color: '#f8ae00', textColor: '#f86300'},
    {id: 3, priority: 'normal', color: '#6fddff', textColor: '#6f93ff'},
    {id: 4, priority: 'low', color: '#d8d8d8', textColor: '#737373'}
]

const priorityTextAndColor = computed(() => {

    const id = priority.value?.id ?? priority.value

    if(id){
        return options.find(option => option.id == id)
    }else{
        return {priority: 'no priority', color: 'gray', textColor: 'white'}
    }
})
</script>


<template>
    <div v-if="editMode">
        <Select
            v-model="priority"
            :options="options"
            placeholder="Select Priority..."
            showClear
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
            :style="{
                backgroundColor: priorityTextAndColor.color,
                color: priorityTextAndColor.textColor
            }"
            class="py-1 px-2 !font-semibold max-w-[90px] w-auto text-sm text-center rounded-md"
        >
            {{ priorityTextAndColor.priority }}
        </div>
    </div>
</template>