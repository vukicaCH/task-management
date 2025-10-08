<script setup>
import { Select } from 'primevue';
import { useTasksStore } from '@/stores/tasksStore';
import { onClickOutside } from '@vueuse/core'

const {task} = defineProps({
    task:{
        type: Object,
        required: true,
    },
})

const taskRef = toRef(()=> task)

const tasksStore = useTasksStore();

const target = useTemplateRef('target')
const ignoreElSelector = '.ignore'

const editMode = ref(false)
const canEditTask = ref(false);

const archived = ref()

watchEffect(()=> archived.value = taskRef.value.archived)

const options = [
    {label: 'Yes', value: true},
    {label: 'No', value: false}
]

onClickOutside(
    target,
    () => {
        if(editMode.value && canEditTask.value){
            tasksStore.editTask(task, {archived: archived.value})
        }

        canEditTask.value = false
        editMode.value = false
    },
    {ignore: [ignoreElSelector]}
)

watch(archived, () => canEditTask.value = archived.value != taskRef.value.archived)
</script>

<template>
    <div v-if="editMode" ref="target">
        <Select
            v-model="archived"
            :options="options"
            option-label="label"
            option-value="value"
            :pt="{option: 'ignore'}"
        />
    </div>
    <div v-else>
        <div @click="editMode = true" class="cursor-pointer">
            {{ archived ? 'Yes' : 'No' }}
        </div>
    </div>
</template>