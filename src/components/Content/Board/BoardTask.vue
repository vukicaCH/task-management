<script setup>
import { CalendarIcon, PlusCircleIcon } from '@heroicons/vue/24/outline';
import { PencilIcon, CheckIcon } from '@heroicons/vue/24/solid';
import { useElementHover } from '@vueuse/core'
import { useTemplateRef, watch } from 'vue'

const props = defineProps({
    task:{
        type: Object,
        required: true,
    }
})

const boardTaskRef = useTemplateRef('boardTaskRef')
const isHovered = useElementHover(boardTaskRef)

if(props.task.subtasks_count) {
    console.log(props.task)
}

</script>

<template>
    <div class="rounded-md border p-2 w-[225px]" ref="boardTaskRef">
        <div class="flex justify-between relative">
            <div>{{ task.name }}</div>
            <div
                v-if="isHovered"
                class="absolute top-0 right-0 rounded-md border border-gray-600 flex gap-1 items-center p-1"
            >
                <button class="cursor-pointer rounded hover:bg-gray-500 p-1">
                    <check-icon class="w-4 h-4" />
                </button>

                <button class="cursor-pointer rounded hover:bg-gray-500 p-1">
                    <plus-circle-icon class="w-4 h-4" />
                </button>

                <button class="cursor-pointer rounded hover:bg-gray-500 p-1">
                    <pencil-icon class="w-4 h-4" />
                </button>
            </div>
        </div>

        <div class="!mt-5">
            <button class="cursor-pointer rounded border border-gray-600 hover:bg-gray-700 p-1">
                <calendar-icon class="w-4 h-4" />
            </button>
        </div>

        <div v-if="task.subtasks_count">
            <button class="cursor-pointer text-xs">Subtasks: {{ task.subtasks_count }}</button>
        </div>
    </div>
</template>