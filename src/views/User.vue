<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :options.sync="options"
      :server-items-length="rowCount"
      :loading="loading"
      :footer-props="{
        'items-per-page-options': [5, 10, 15, 50, 100],
      }"
      disable-sort
      show-select
      item-key="id"
      v-model="selected"
      class="elevation-1---"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn
            class="mx-2"
            depressed
            color="primary"
            @click="
              drawerFrom = 'addUser';
              drawer = true;
            "
            >添加用户</v-btn
          >
          <v-btn class="mx-2" depressed @click="deleteUsers">删除用户</v-btn>
          <v-btn class="mx-2" depressed @click="resetQuota">重置用量</v-btn>
          <v-btn class="mx-2" depressed @click="resetPassword">重置密码</v-btn>
          <v-btn class="mx-2" depressed @click="showQuotaForm">设置额度</v-btn>
          <v-spacer></v-spacer>

          <v-responsive max-width="260">
            <v-text-field
              v-model="options.search"
              dense
              flat
              hide-details
              rounded
              solo-inverted
            ></v-text-field>
          </v-responsive>
        </v-toolbar>
      </template>
      <template v-slot:[`item.upload`]="{ item }">
        <span>{{ getMB(item.upload) }}</span>
      </template>
      <template v-slot:[`item.download`]="{ item }">
        <span>{{ getMB(item.download) }}</span>
      </template>
      <template v-slot:[`item.quota`]="{ item }">
        <span>{{ getMB(item.quota) }}</span>
      </template>
    </v-data-table>

    <!-- 抽屉 -->
    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
      temporary
      style="width: 500px"
    >
      <!-- 添加用户 -->
      <v-form ref="form" style="padding: 20px" v-show="drawerFrom == 'addUser'">
        <v-text-field
          :counter="10"
          label="用户名"
          v-model="user.username"
          :rules="user.nameRules"
          required
        ></v-text-field>

        <v-text-field
          label="密码"
          v-model="user.password"
          required
        ></v-text-field>
        <v-select
          :items="quotas"
          :item-value="'value'"
          :item-text="'name'"
          :rules="[(v) => !!v || 'Item is required']"
          v-model="user.quota"
          label="额度"
          required
        ></v-select>
        <v-select
          :items="days"
          :item-value="'value'"
          :item-text="'name'"
          :rules="[(v) => !!v || 'Item is required']"
          v-model="user.days"
          label="有效期"
          required
        ></v-select>

        <v-btn color="success" class="mr-4" @click="addUser">提交</v-btn>
        <v-btn color="error" class="mr-4" @click="reset">重置</v-btn>
      </v-form>
      <!-- 设置额度 -->
      <v-form ref="form" style="padding: 20px" v-show="drawerFrom == 'quota'">
        <v-select
          :items="quotas"
          :item-value="'value'"
          :item-text="'name'"
          :rules="[(v) => !!v || 'Item is required']"
          v-model="quota.quota"
          label="额度"
          required
        ></v-select>
        <v-select
          :items="days"
          :item-value="'value'"
          :item-text="'name'"
          :rules="[(v) => !!v || 'Item is required']"
          v-model="quota.days"
          label="有效期"
          required
        ></v-select>

        <v-btn color="success" class="mr-4" @click="setQuota">确认</v-btn>
      </v-form>
    </v-navigation-drawer>

    <!-- 新密码显示框 -->
    <v-dialog v-model="dialog" max-width="460">
      <v-simple-table style="padding: 20px 30px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">用户名</th>
              <th class="text-left">新密码</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in userPasswords" :key="item.username">
              <td>{{ item.username }}</td>
              <td>{{ item.password }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-dialog>
  </div>
</template>
<style >
.v-toolbar .v-toolbar__content {
  padding-left: 10px !important;
}
</style>
<script>
import axios from "axios";

axios.defaults.baseURL = "http://localhost:1323";

export default {
  data() {
    return {
      drawer: null,
      drawerFrom: null,
      loading: false,
      dialog: false,
      rowCount: 10,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        mustSort: false,
        multiSort: false,
        search: "",
      },
      selected: [],
      headers: [
        { text: "ID", value: "id" },
        { text: "用户名", value: "username" },
        { text: "额度(B)", value: "quota", align: "start", sortable: false },
        { text: "下行流量 (B)", value: "download" },
        { text: "上行流量 (B)", value: "upload" },
        { text: "创建于", value: "createdAt" },
        { text: "到期时间", value: "expiresAt" },
      ],
      desserts: [
        {
          id: "1",
          username: "Zero",
          quota: -1,
          download: 8137210,
          upload: 648714,
          createdAt: 648714,
          expiresAt: 648714,
        },
      ],

      user: {
        valid: false,
        firstname: "",
        lastname: "",
        nameRules: [
          (v) => !!v || "Name is required",
          (v) =>
            (v && v.length <= 10) || "Name must be less than 10 characters",
        ],
        email: "",
        emailRules: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+/.test(v) || "E-mail must be valid",
        ],
        quota: 5 * 1024_000_000,
        days: 30,
      },
      quota: {
        quota: 5 * 1024_000_000,
        days: 30,
      },
      quotas: [
        { name: "1 GB", value: 1024_000_000 },
        { name: "5 GB", value: 5 * 1024_000_000 },
        { name: "10 GB", value: 10 * 1024_000_000 },
      ],
      // quotas: [1, 5, 10],
      // days: [7, 15, 30, 60],
      days: [
        { name: "7 天", value: 7 },
        { name: "15 天", value: 15 },
        { name: "30 天", value: 30 },
        { name: "60 天", value: 60 },
      ],
      userPasswords: [],
    };
  },
  watch: {
    options: {
      handler() {
        this.userList();
      },
      deep: true,
    },
  },
  mounted() {
    this.userList();
  },
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    showQuotaForm() {
      if (this.selected.length === 0) {
        alert("请选择用户");
      }
      this.drawerFrom = "quota";
      this.drawer = true;
    },
    userList() {
      this.loading = true;
      const options = this.options;
      axios
        .get("/api/user/list", {
          params: {
            username: options.search,
            page: options.page,
            pageSize: options.itemsPerPage,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.desserts = response.data.items;
          this.rowCount = response.data.rowCount;
          this.loading = false;
        })
        .catch(function (error) {
          // 请求失败处理
          console.log(error);
          this.loading = false;
        });
    },
    //https://github.com/axios/axios#example
    addUser() {
      axios
        .post("/api/user/create", {
          username: this.user.username,
          password: this.user.password,
          days: this.user.days,
          quota: this.user.quota,
        })
        .then(() => {
          this.userList();
          this.reset();
        })
        .catch(function (error) {
          // 请求失败处理
          var data = error.response.data;
          alert(data.message);
          console.log(error);
        });
    },
    deleteUsers() {
      if (this.selected.length === 0) {
        return;
      }
      if (!confirm("你确定要删除该用户吗?")) {
        return;
      }
      const ids = this.selected.map((v) => v.id).join(",");
      axios
        .post("/api/user/delete?id=" + ids)
        .then(() => {
          this.userList();
        })
        .catch(function (error) {
          var data = error.response.data;
          alert(data.message);
          console.log(error);
        });
    },
    resetQuota() {
      if (this.selected.length === 0) {
        return;
      }
      if (!confirm("你确定要重置用量吗?")) {
        return;
      }
      const ids = this.selected.map((v) => v.id).join(",");
      axios
        .post("/api/user/reset_quota?id=" + ids)
        .then(() => {
          this.userList();
        })
        .catch(function (error) {
          var data = error.response.data;
          alert(data.message);
          console.log(error);
        });
    },
    setQuota() {
      if (this.selected.length === 0) {
        return;
      }
      const ids = this.selected.map((v) => v.id).join(",");
      axios
        .post("/api/user/quota", {
          ids: ids,
          quota: this.quota.quota,
          days: this.quota.days,
        })
        .then(() => {
          this.userList();
        })
        .catch(function (error) {
          var data = error.response.data;
          alert(data.message);
          console.log(error);
        });
    },
    resetPassword() {
      if (this.selected.length === 0) {
        return;
      }
      if (!confirm("你确定要重置所选用户密码吗?")) {
        return;
      }
      const ids = this.selected.map((v) => v.id).join(",");
      axios
        .post("/api/user/reset_password?id=" + ids)
        .then((response) => {
          this.userPasswords = response.data;
          this.dialog = true;
          this.userList();
        })
        .catch(function (error) {
          var data = error.response.data;
          alert(data.message);
          console.log(error);
        });
    },
    getMB(bytes) {
      if (bytes < 0) return "-";
      if (bytes >= 1024_000_000)
        return (bytes / 1024_000_000).toFixed(2) + "GB";
      else if (bytes >= 1024_000) return (bytes / 1024_000).toFixed(2) + "MB";
      else if (bytes > 1024) return (bytes / 1024).toFixed(2) + "KB";
      else return bytes + "B";
    },
  },
};
</script>