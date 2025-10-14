<template>
    <div class="animate-pulse">
        <div class="flex gap-4">
            <div>
                <div class="!space-y-0.75 p-1">
                    <div class="w-[250px] h-[90px] bg-gray-700 rounded-lg" v-for="index in 10" :key="index"></div>
                </div>
            </div>

            <div>
                <div class="!space-y-0.75 p-1">
                    <div class="w-[250px] h-[90px] bg-gray-700 rounded-lg" v-for="index in 10" :key="index"></div>
                </div>
            </div>
        </div>
    </div>
</template>