<script setup>
import { InputText } from 'primevue';
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

const toggleEditMode = () => {
    editMode.value = !editMode.value;
    tasksStore.listEditMode = !tasksStore.listEditMode;
}

const name = ref()

watchEffect(()=> name.value = taskRef.value.name)

onClickOutside(
    target,
    () => {
        if(editMode.value && canEditTask.value){
            tasksStore.editTask(task, {name: name.value})
        }

        canEditTask.value = false
        toggleEditMode()
    },
    {ignore: [ignoreElSelector]}
)

watch(name, () => canEditTask.value = name.value != taskRef.value.name)
</script>

<template>
    <div v-if="editMode" ref="target">
        <InputText v-model="name" />
    </div>
    <div v-else @click="toggleEditMode" class="cursor-pointer">
        {{ name }}
    </div>
</template>