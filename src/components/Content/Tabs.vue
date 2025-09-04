<script setup>
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import SpaceOverview from './Overview/Space.vue';
import SpaceList from './List/Space.vue';



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
                    <p class="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                        qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                    </p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>