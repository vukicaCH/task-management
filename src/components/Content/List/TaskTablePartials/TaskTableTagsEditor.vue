<script setup>
import { useSpaceStore } from '@/stores/spaceStore'
import _ from 'lodash'

const {task} = defineProps({
    task: {
        type: Object,
        required: true
    }
})

const spaceStore = useSpaceStore()

const openForm = inject('openForm')

const reactiveTags = computed(() => {
    const spaceId = props.task.space.id;

    const tagNames = [task.tags.map(tag => tag.name)]

    return spaceStore.tags[spaceId].filter(tag => tagNames.includes(tag.name))
})

</script>

<template>
    <div @click="() => openForm('EditTags', task)">
        <div v-if="reactiveTags.length" class="flex gap-1 items-start">
            <div
                class="text-xs cursor-pointer text-white"
                v-for="tag in reactiveTags.slice(0,2)"
            >
                <div :style="{backgroundColor: tag.tag_bg}" class="px-2 py-1 rounded-md !font-bold hover:text-gray-300">
                    {{ tag.name.length > 6 ? tag.name.slice(0,7) + '...' : tag.name  }}
                </div>
            </div>
            <div
                class="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300 hover:bg-gray-400 hover:text-gray-700 cursor-pointer"
                v-if="reactiveTags.slice(2).length"
            >
                {{ `+${task.tags.slice(2).length}` }}
            </div>
        </div>
        <div v-else class="!font-medium hover:text-gray-500 cursor-pointer border p-3 rounded-md w-[100px] text-center">Add +</div>
    </div>
</template>