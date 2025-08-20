import CreateSpace from "@/components/Forms/Space/CreateSpace.vue";
import EditSpace from "@/components/Forms/Space/EditSpace.vue";
import DeleteSpace from "@/components/Forms/Space/DeleteSpace.vue";
import CreateFolder from "@/components/Forms/Folder/Create.vue";
import EditFolder from "@/components/Forms/Folder/Edit.vue";
import DeleteFolder from "@/components/Forms/Folder/Delete.vue";

export default function (id) {
    const forms = {
        CreateSpace,
        EditSpace,
        DeleteSpace,
        CreateFolder,
        EditFolder,
        DeleteFolder
    }

    return forms[id]
}