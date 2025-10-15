<script setup>
import Sidebar from './components/Sidebar.vue';
import Content from './components/Content/Content.vue';
import Forms from './forms/Forms.vue';
</script>

<template>
  <Forms />

  <div class="hidden sm:grid grid-cols-5 gap-8 px-5 h-[800px]">
    <Sidebar />
    <Content class="col-span-4" />
  </div>
  <div class="sm:hidden flex w-full h-100 items-center justify-center px-10 text-center">
    App is not compatible for mobile. Please switch to PC.
  </div>
</template>
