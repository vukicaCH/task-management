<script setup>
import List from './List.vue';

const props = defineProps({
    lists:{
        type: Array,
        required: true
    }
})
</script>

<template>
    <List v-for="list in lists" :list="list" />
</template>