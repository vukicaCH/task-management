<script setup>
import DatePicker from 'primevue/datepicker';

const props = defineProps({
    disabled:{
        type: Boolean,
        required: false,
        default: false
    }
})

const date = defineModel('date');
</script>

<template>
    <DatePicker
        v-model="date"
        dateFormat="dd/mm/yy"
        show-button-bar
        show-icon
        :clear-button-props="{hidden: !date}"
        @clear-click="date = ''"
        :disabled="disabled"
    />
</template>