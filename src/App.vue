<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer v-model="drawer" app>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Trojan Panel</v-list-item-title>
            <v-list-item-subtitle>欢迎使用</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
          <!-- 加上mandatory点击两次就不会取消选中 -->
          <v-list-item-group v-model="itemIndex" mandatory>
            <template v-for="item in items">
              <router-link :to="item.link" :key="item.title">
                <v-list-item color="primary" link>
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </router-link>
            </template>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <!-- flat 会去掉阴影-->
      <v-app-bar color="white" height="60" flat app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-container class="py-0 fill-height">
          <v-avatar class="mr-10" color="grey darken-1" size="32"></v-avatar>

          <v-btn v-for="link in links" :key="link" text>{{ link }}</v-btn>

          <v-spacer></v-spacer>

        </v-container>
      </v-app-bar>

      <!-- Sizes your content based upon application components -->
      <v-main>
        <!-- Provides the application the proper gutter -->
        <v-container fluid>
          <!-- If using vue-router -->
          <router-view></router-view>
        </v-container>
      </v-main>

      <v-footer app>
        <!-- -->
      </v-footer>
    </v-app>
  </div>
</template>

<style>
</style>
<script>
export default {
  data: () => ({
    drawer: null,
    links: ["Dashboard", "Messages", "Profile", "Updates"],
    itemIndex: 0, //被选中的项
    items: [
      { title: "用户管理", icon: "mdi-image", link: "/" },
    ]
  })
};
</script>
