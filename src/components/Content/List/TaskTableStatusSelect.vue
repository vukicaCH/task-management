<script setup>
import { Select } from 'primevue';
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
const spaceStore = useSpaceStore();

const target = useTemplateRef('target')
const ignoreElSelector = '.ignore'

const editMode = ref(false)
const canEditTask = ref(false);

const status = ref()

watchEffect(()=> status.value = taskRef.value.status)

const options = computed(() => spaceStore.currentSpace.statuses)

onClickOutside(
    target,
    () => {
        if(editMode.value && canEditTask.value){
            tasksStore.editTask(props.task.id, {status: status.value.status})
        }

        canEditTask.value = false
        editMode.value = false
    },
    {ignore: [ignoreElSelector]}
)

watch(status, () => canEditTask.value = status.value.id != taskRef.value.status?.id)
</script>

<template>
    <div v-if="editMode" ref="target">
        <Select
            v-model="status"
            :options="options"
            option-label="status"
            :pt="{option: 'ignore'}"
        />
    </div>
    <div v-else>
        <div @click="() => {editMode = true; tasksStore.currentTaskEdit = task}" :style="{borderColor: status.color, color: status.color}" class="cursor-pointer border px-2 py-1 rounded-md">
            {{ status.status }}
        </div>
    </div>
</template>