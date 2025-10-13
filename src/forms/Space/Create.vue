<script setup>
import axiosIns from '@/axios'
import { useSpaceStore } from '@/stores/spaceStore';
import { useFormsStore } from '@/stores/formsStore';

const spaceStore = useSpaceStore();
const formsStore = useFormsStore();

const spaceName = ref('')

const createSpace = (e) => {
    e.preventDefault()

    axiosIns
        .post('/team/90151303803/space', {name: spaceName.value})
        .then((res)=>{
            spaceStore.addSpace(res.data)
            formsStore.toggleForm()
        })
}
</script>

<template>
    <div>
        <p class="text-surface-500 dark:text-surface-400">
            A Space represents teams, departments, or groups, each with its own Lists, workflows, and settings.
        </p>

        <form @submit="(e) => createSpace(e)">
            <div class="pt-8 flex gap-2">
                <span>Name</span>
                <input v-model="spaceName" class="border border-white" />
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>

</template>