<template>
  <el-container >
    <el-container style="height: 100% ">
      <el-aside>
        <LeftMenu></LeftMenu>
      </el-aside>
      <el-main>
        <router-view class="main-view"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LeftMenu from './leftmenu.vue'
export default {
  name: 'ViewNode',
  components: {
    LeftMenu,
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  height: auto;
  padding: 5px;
}
.el-aside{
  width: auto;
  height: 100%;
}
.el-divider--horizontal{
  margin: 0;
}
.el-main{
  padding: 12px;
  height: 100%;
}
.el-container{
  height: 100%;
}
</style>
