<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      show-select
      item-key="name"
      v-model="selected"
      class="elevation-1---"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn class="mx-2" depressed @click="drawer = !drawer">Normal</v-btn>
          <v-btn class="mx-2" depressed color="primary">Primary</v-btn>
          <v-btn class="mx-2" depressed color="error">Error</v-btn>
          <v-btn class="mx-2" depressed disabled>Disabled</v-btn>
          <v-spacer></v-spacer>
          <v-text-field append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item.calories="{ item }">
        <v-chip :color="getColor(item.calories)" dark>{{ item.calories }}</v-chip>
      </template>
    </v-data-table>
    <v-navigation-drawer v-model="drawer" absolute right temporary style="width:500px">
      <v-form ref="form" style="padding:20px">
        <v-text-field
          :counter="10"
          label="Name"
          v-model="user.firstname"
          :rules="user.nameRules"
          required
        ></v-text-field>

        <v-text-field label="E-mail" v-model="user.email" :rules="user.emailRules" required></v-text-field>
        <!-- 注意: 单引号 -->
        <v-select
          :items="desserts"
          :item-value="'name'"
          :item-text="'name'"
          :rules="[v => !!v|| 'Item is required']"
          label="Item"
          required
        ></v-select>

        <v-checkbox
          :rules="[v => !!v || 'You must agree to continue!']"
          label="Do you agree?"
          required
        ></v-checkbox>

        <v-btn color="success" class="mr-4">Submit</v-btn>

        <v-btn color="error" class="mr-4" @click="reset">Reset</v-btn>
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
export default {
  data() {
    return {
      drawer: null,
      selected: [],
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" }
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%"
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%"
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%"
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%"
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%"
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%"
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%"
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%"
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%"
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%"
        }
      ],
      user: {
        valid: false,
        firstname: "",
        lastname: "",
        nameRules: [
          v => !!v || "Name is required",
          v => (v && v.length <= 10) || "Name must be less than 10 characters"
        ],
        email: "",
        emailRules: [
          v => !!v || "E-mail is required",
          v => /.+@.+/.test(v) || "E-mail must be valid"
        ]
      }
    };
  },
  methods: {
    getColor(calories) {
      if (calories > 400) return "red";
      else if (calories > 200) return "orange";
      else return "green";
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>