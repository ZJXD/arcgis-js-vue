<template>
  <div class="navWrap">
    <ul>
      <li v-for="(item, index) in navData" :key="index" class="navWrap_item">
        <span @click="routerTo(item.route)">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {
    navData: {
      type: Array,
      default: () => { }
    }
  },
  data() {
    return {};
  },
  mounted() {
    console.log("123", this.navData);
  },
  methods: {
    routerTo(route) {
      console.log(route);
      this.$router.push(route);
    }
  }
};
</script>

<style scope>
.navWrap_item {
  cursor: pointer;
  padding: 5px;
  list-style: none;
}
.navWrap ul li {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-color: #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 10px;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
}
</style>
