<script setup>
import { InputText } from 'primevue';
import { useSpaceStore } from '@/stores/spaceStore';
import { useTasksStore } from '@/stores/tasksStore';
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
    task:{
        type: Object,
        required: true,
    },
})

const taskRef = toRef(()=> props.task)

const tasksStore = useTasksStore();

const target = useTemplateRef('target')
const ignoreElSelector = '.ignore'

const editMode = ref(false)
const canEditTask = ref(false);

const name = ref()

watchEffect(()=> name.value = taskRef.value.name)

onClickOutside(
    target,
    () => {
        if(editMode.value && canEditTask.value){
            tasksStore.editTask(props.task.id, {name: name.value})
        }

        canEditTask.value = false
        editMode.value = false
    },
    {ignore: [ignoreElSelector]}
)

watch(name, () => canEditTask.value = name.value != taskRef.value.name)
</script>

<template>
    <div v-if="editMode" ref="target">
        <InputText v-model="name" />
    </div>
    <div v-else @click="editMode = true" class="cursor-pointer">
        {{ name }}
    </div>
</template>