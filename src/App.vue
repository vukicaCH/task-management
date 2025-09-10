<script setup>
import Sidebar from './components/Sidebar.vue';
import Content from './components/Content/Content.vue';
import Forms from './components/Forms.vue';
import { useSpaceStore } from './stores/spaceStore';

const tasksStore = useSpaceStore()

onMounted(()=> tasksStore.getViews())
</script>

<template>
  <Forms />

  <div class="grid grid-cols-5 gap-8 px-5">
    <Sidebar />
    <Content class="col-span-4" />
  </div>
</template>
