<script setup>

const taskName = ref('')

</script>

<template>
    <div class="rounded-md w-full p-1 bg-gray-800">
        <div class="flex justify-between">
            <input v-model="taskName" class="focus:ring-0 focus:outline-none" placeholder="Subtask Name..."/>
            <button
                class="bg-white text-black py-1 px-2 rounded-md !font-medium disabled:bg-gray-400"
                :disabled="!taskName"
            >
                Save
            </button>
        </div>
    </div>
</template>