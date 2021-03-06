<template>
  <div>
    <a-row justify="space-between" align="middle">
      <a-col :span="10" style="margin-left: 8px">
        <a-row justify="start" align="middle">
          <a-col :span="12">
            <a-row align="middle"
              >菜单名称：
              <a-col :span="18">
                <a-input
                  v-model:value="searchData.menuName"
                  @keydown.enter="getList"
                ></a-input>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="11" style="margin-left: 8px">
            <a-row align="middle"
              >菜单状态：
              <a-col>
                <a-radio-group
                  name="status"
                  v-model:value="searchData.stopFlag"
                  @change="getList"
                >
                  <a-radio :value="null">
                    全部
                  </a-radio>
                  <a-radio :value="0">
                    启用
                  </a-radio>
                  <a-radio :value="1">
                    停用
                  </a-radio>
                </a-radio-group>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
      <a-button @click="addMenu">添加</a-button>
    </a-row>
    <a-table
      class="table"
      :data-source="menuList"
      rowKey="id"
      :pagination="false"
    >
      <a-table-column title="序号">
        <template #default="{ index }">
          <span>
            {{ index + 1 }}
          </span>
        </template>
      </a-table-column>
      <a-table-column title="菜单名称">
        <template #default="{ record }">
          <span>
            {{ record.menuName }}
          </span>
        </template>
      </a-table-column>
      <a-table-column title="路由地址">
        <template #default="{ record }">
          <span>
            {{ record.routeName }}
          </span>
        </template>
      </a-table-column>
      <a-table-column title="文件地址">
        <template #default="{ record }">
          <span>
            {{ record.filePath }}
          </span>
        </template>
      </a-table-column>
      <a-table-column title="状态">
        <template #default="{ record }">
          <a-tag v-if="record.stopFlag == 0" color="#7B68EE">
            启用
          </a-tag>
          <a-tag v-else color="#DC143C">
            停用
          </a-tag>
        </template>
      </a-table-column>
      <a-table-column title="创建时间">
        <template #default="{ record }">
          <span>
            {{ record.createAt }}
          </span>
        </template>
      </a-table-column>
      <a-table-column title="更新时间">
        <template #default="{ record }">
          <span>
            {{ record.updateAt }}
          </span>
        </template>
      </a-table-column>
      <a-table-column title="操作">
        <template #default="{ record }">
          <a-button @click="editMenu(record)">修改</a-button>
          <a-button @click="changeMenuStatus(record)">{{
            record.stopFlag == 1 ? "启用" : "停用"
          }}</a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-row justify="end">
      <a-pagination
        class="pagination"
        @change="onChange"
        @showSizeChange="onSizeChange"
        :total="pageInfo.total"
        v-model:current="pageInfo.current"
        :show-total="(total) => `共${total}条`"
        :pageSizeOptions="pageSize"
        :defaultPageSize="pageInfo.size"
        :showSizeChanger="true"
        ><template #buildOptionText="props">
          <span>{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </a-row>
    <menu-modal
      ref="menuModal"
      :menuId="selectedMenuID"
      @close="getList"
      :type="type"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from "vue";
import { getMenuList, changeStatus } from "@/api/menu";
import menuModal from "./components/menuModal.vue";
import { Modal, message } from "ant-design-vue";
export default defineComponent({
  components: {
    menuModal,
  },
  name: "menuList",
  setup() {
    const menuList = ref([]);
    const searchData = ref({ menuName: "", stopFlag: null });
    const pageInfo = ref({
      total: 0,
      size: 20,
      current: 1,
    });
    const pageSize = ref(["10", "20", "30", "40", "50"]);
    const menuModal = ref(null);
    const selectedMenuID = ref(null);
    const type = ref("add");
    const getList = () => {
      getMenuList(
        Object.assign({ menuName: searchData.value.menuName,stopFlag:searchData.value.stopFlag }, pageInfo.value)
      ).then((res: any) => {
        pageInfo.value.total = res.data.total;
        menuList.value = res.data.records;
      });
    };
    const opneModal = () => {
      nextTick(() => {
        (menuModal.value as any).open();
      });
    };
    getList();
    const addMenu = () => {
      type.value = "add";
      opneModal();
    };
    const editMenu = (data: any) => {
      selectedMenuID.value = data.id;
      type.value = "edit";
      opneModal();
    };
    const changeMenuStatus = (data: any) => {
      Modal.confirm({
        title: `确认`,
        content: `确定${data.stopFlag == 1 ? "启用" : "停用"}吗`,
        onOk() {
          changeStatus({ id: data.id }).then((res: any) => {
            if (res.code == 200) {
              message.success("修改成功");
              pageInfo.value = {
                total: 0,
                size: 20,
                current: 1,
              };
              getList();
            }
          });
        },
        onCancel() {
          console.log("取消");
        },
      });
    };
    const onChange = (page: number, pageSize: number) => {
      pageInfo.value = {
        total: 0,
        size: pageSize,
        current: page,
      };
      getList();
    };
    const onSizeChange = (current: number, size: number) => {
      pageInfo.value = {
        total: 0,
        size: size,
        current: current,
      };
      getList();
    };
    return {
      pageSize,
      menuList,
      searchData,
      pageInfo,
      getList,
      opneModal,
      editMenu,
      addMenu,
      menuModal,
      type,
      selectedMenuID,
      changeMenuStatus,
      onSizeChange,
      onChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.pagination {
  display: inline-block;
}
</style>
