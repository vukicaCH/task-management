<script setup>
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Overview from './Overview/Overview.vue';
import List from './List/List.vue';
import Board from './Board/Board.vue';
import { useViewsStore } from '@/stores/viewsStore';
import { useSpaceStore } from '@/stores/spaceStore';

const viewsStore = useViewsStore();
const spaceStore = useSpaceStore();

const tabs = computed(() => spaceStore.currentType === 'space' ? ['overview', 'list', 'board'] : ['list', 'board'])

</script>
    
<template>
    <div class="card">
        <Tabs v-model:value="viewsStore.currentViewTab" :lazy="true">
            <div class="flex gap-1">
                <div
                    v-for="tab in tabs"
                    @click="viewsStore.currentViewTab = tab"
                    class="w-[100px] h-[45px] hover:bg-gray-700 cursor-pointer flex justify-center items-center rounded-md border !font-medium"
                    :class="{'border-white text-white' : tab === viewsStore.currentViewTab}"
                    >
                   {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
                </div>
            </div>
            <TabPanels>
                <TabPanel value="overview">
                    <Overview />
                </TabPanel>
                <TabPanel value="list">
                    <List />
                </TabPanel>
                <TabPanel value="board">
                    <Board />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>