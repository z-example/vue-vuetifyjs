<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :options.sync="options"
      :server-items-length="rowCount"
      :loading="loading"
      :footer-props="{
        'items-per-page-options': [10, 15, 50, 100],
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
            @click="drawer = !drawer"
            >添加用户</v-btn
          >
          <v-btn class="mx-2" depressed @click="deleteUsers">删除用户</v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="options.search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
      temporary
      style="width: 500px"
    >
      <v-form ref="form" style="padding: 20px">
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
          label="额度"
          required
        ></v-select>

        <v-btn color="success" class="mr-4" @click="addUser">提交</v-btn>
        <v-btn color="error" class="mr-4" @click="reset">重置</v-btn>
      </v-form>
    </v-navigation-drawer>
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
      loading: false,
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
        quota: 5,
        days: 30,
      },
      quotas: [
        { name: "1 GB", value: 1 },
        { name: "5 GB", value: 5 },
        { name: "10 GB", value: 10 },
      ],
      // quotas: [1, 5, 10],
      // days: [7, 15, 30, 60],
      days: [
        { name: "7 天", value: 7 },
        { name: "15 天", value: 15 },
        { name: "30 天", value: 30 },
        { name: "60 天", value: 60 },
      ],
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
          quota: this.user.quota * 1024_000_000,
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
      const ids = this.selected.map((v) => v.id).join(",");
      axios
        .post("/api/user/delete?id=" + ids)
        .then(() => {
          alert("删除成功");
        })
        .catch(function (error) {
          var data = error.response.data;
          alert(data.message);
          console.log(error);
        });
    },
  },
};
</script>