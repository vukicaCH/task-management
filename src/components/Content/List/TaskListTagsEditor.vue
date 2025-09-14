<script setup>

const props = defineProps({
    tags:{
        type: Array,
        required: true
    },
})

const openForm = inject('openForm')
</script>

<template>
    <div @click="() => openForm('EditTags')">
        <div v-if="tags.length" class="flex gap-1 items-start">
            <div
                class="text-xs text-gray-700 cursor-pointer text-white"
                v-for="tag in tags.slice(0,2)"
            >
                <div :style="{backgroundColor: tag.tag_bg}" class="px-2 py-1 rounded-md !font-bold hover:text-gray-300">
                    {{ tag.name.length > 6 ? tag.name.slice(0,7) + '...' : tag.name  }}
                </div>
            </div>
            <div
                class="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300 hover:bg-gray-400 hover:text-gray-700 cursor-pointer"
                v-if="tags.slice(1).length"
            >
                {{ `+${tags.slice(1).length - 1}` }}
            </div>
        </div>
        <div v-else class="!font-medium hover:text-gray-500 cursor-pointer border p-3 rounded-md w-[100px] text-center">Add +</div>
    </div>
</template>