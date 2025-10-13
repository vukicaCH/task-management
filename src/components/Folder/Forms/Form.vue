<script setup>
import Create from '@/forms/List/Create.vue';
import Edit from '../../../forms/Folder/Edit.vue';
import Delete from '../../../forms/Folder/Delete.vue';
import Move from './Move.vue';
import { toRef } from 'vue';

const props = defineProps({
  currentForm:{
    type: String,
    default: '',
    required: true,
  },

  folder:{
    type: Object,
    required: true,
  },
})

const forms = {Edit, Delete, Move, Create}

const refForm = toRef(() => props.currentForm);
</script>

<template>
    <component
      :is="forms[refForm]"
      :folder="folder"
    />
</template>