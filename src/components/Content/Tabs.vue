<script setup>
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import SpaceOverview from './Overview/Space.vue';
import SpaceList from './List/Space.vue';
import SpaceBoard from './Board/Space.vue';
import { useViewsStore } from '@/stores/viewsStore';
import { useSpaceStore } from '@/stores/spaceStore';

const viewsStore = useViewsStore();
const spaceStore = useSpaceStore();

</script>
    
<template>
    <div class="card">
        <Tabs v-model:value="viewsStore.currentViewTab" :lazy="true">
            <TabList>
                <Tab value="overview" v-if="spaceStore.currentType === 'space'">Overview</Tab>
                <Tab value="list">List</Tab>
                <Tab value="board">Board</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="overview">
                    <SpaceOverview />
                </TabPanel>
                <TabPanel value="list">
                    <SpaceList />
                </TabPanel>
                <TabPanel value="board">
                    <SpaceBoard />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>