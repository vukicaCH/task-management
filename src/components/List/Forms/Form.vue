<script setup>
import Edit from '../../../forms/List/Edit.vue';
import Delete from '../../../forms/List/Delete.vue';
import Move from './Move.vue';
import { toRef } from 'vue';

const props = defineProps({
  currentForm:{
    type: String,
    default: '',
    required: true,
  },

  list:{
    type: Object,
    required: true,
  },
})

const forms = {Edit, Delete, Move}

const refForm = toRef(() => props.currentForm);
</script>

<template>
    <component
      :is="forms[refForm]"
      :list="list"
    />
</template>