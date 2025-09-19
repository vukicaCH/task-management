<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { useSpaceStore } from '@/stores/spaceStore';
import { useTasksStore } from '@/stores/tasksStore';
import { MultiSelect } from 'primevue';
import { onBeforeMount } from 'vue';
import Tag from './Tag.vue';

const formsStore = useFormsStore()
const tasksStore = useTasksStore()
const spaceStore = useSpaceStore()

const taskSpaceId = formsStore.task.space.id;

const tags = ref([...formsStore.task.tags]);
const tagOptions = computed(() => spaceStore.tags[taskSpaceId])

const loading = ref(false);

onBeforeMount(async () => {
    if(!(taskSpaceId in spaceStore.tags)){
        loading.value = true;

        await spaceStore.hydrateSpaceTags(taskSpaceId)

        loading.value = false;
    }
})

</script>

<template>
    <div>
        <p class="text-surface-500 dark:text-surface-400 !mb-3">
            Tags for <i>"{{ formsStore.task.name }}"</i>:
        </p>

        <MultiSelect
            v-if="!loading && tagOptions"
            v-model="tags"
            :options="tagOptions"
            placeholder="Choose Tags"
            data-key="name"
            option-label="name"
            multiple
            filter
        >
            <template #value="{value}">
                <div class="!space-x-3 flex">
                    <Tag v-for="tag in value" :tag="tag"/>
                </div>
            </template>
            <template #option="{option}">
                <div class="w-full" @click="() => console.log(tags)">{{ option.name }}</div>
            </template>
        </MultiSelect>
        <div v-else>loading...</div>
    </div>
</template>