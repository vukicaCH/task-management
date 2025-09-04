<script setup>
import CreateList from '@/components/List/Forms/Create.vue';
import CreateFolder from '@/components/Folder/Forms/Create.vue';
import Edit from './Edit.vue';
import Delete from './Delete.vue';
import { toRef } from 'vue';

const props = defineProps({
  currentForm:{
    type: String,
    default: '',
    required: true,
  },

  space:{
    type: Object,
    required: true,
  },
})

const forms = { Edit, Delete, CreateFolder, CreateList}

const refForm = toRef(() => props.currentForm);
</script>

<template>
    <component
      :is="forms[refForm]"
      :space="space"
    />
</template>