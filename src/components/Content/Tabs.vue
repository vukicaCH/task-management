<script setup>
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import SpaceOverview from './Overview/Space.vue';
import SpaceList from './List/Space.vue';
import SpaceBoard from './Board/Space.vue';
</script>
    
<template>
    <div class="card">
        <Tabs value="0" :lazy="true">
            <TabList>
                <Tab value="0">Overview</Tab>
                <Tab value="1">List</Tab>
                <Tab value="2">Board</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <SpaceOverview />
                </TabPanel>
                <TabPanel value="1">
                    <SpaceList />
                </TabPanel>
                <TabPanel value="2">
                    <SpaceBoard />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>