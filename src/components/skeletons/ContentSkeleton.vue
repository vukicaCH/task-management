<template>
    <div class="animate-pulse">
        <div class="flex gap-2 !mt-2">
            <div class="w-32 h-10 rounded-lg bg-gray-700" v-for="index in 3" :key="index"></div>
        </div>

        <div class="grid grid-cols-2 gap-10 !mt-6">
            <div>
                <div class="!mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                    <div class="h-10 rounded-lg bg-gray-700 w-72" v-for="index in 6" :key="index"></div>
                </div>
            </div>
            <div>
                <div class="!mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                    <div class="h-10 rounded-lg bg-gray-700 w-72" v-for="index in 6" :key="index"></div>
                </div>
            </div>
        </div>
    </div>
</template>    