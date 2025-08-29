<script setup>
import Create from '@/components/List/Forms/Create.vue';
import Edit from './Edit.vue';
import Delete from './Delete.vue';
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