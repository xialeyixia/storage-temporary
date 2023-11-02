<template>
  <div class="menu">
    <div class="collapse">
      <el-collapse v-model="collapseIndex" accordion @change="changeCollapse">
        <el-collapse-item :title="$t('menu.compute')" name="1">
          <ResourceTree :style="footerwintype == 'large' ? 'max-height: calc(100vh - 458px)' : 'max-height: calc(100vh - 182px)'"></ResourceTree>
        </el-collapse-item>
        <el-collapse-item :title="$t('common.storage')" name="2">
          <StorageTree :style="footerwintype == 'large' ? 'max-height: calc(100vh - 458px)' : 'max-height: calc(100vh - 182px)'" v-if="collapseIndex == '2'"></StorageTree>
        </el-collapse-item>
        <el-collapse-item title="GPU" name="3">
          <GPUMenu :style="footerwintype == 'large' ? 'max-height: calc(100vh - 458px)' : 'max-height: calc(100vh - 182px)'" v-if="collapseIndex == '3'"></GPUMenu>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import ResourceTree from './layoutView/resourcetree.vue'
// import StorageMenu from './layoutView/storagemenu.vue'
import StorageTree from './layoutView/storagetree.vue'
import GPUMenu from './layoutView/gpumenu.vue'
export default {
  name: 'CompAside',
  props: {
    footerwintype: String
  },
  components: {
    ResourceTree,
    // StorageMenu,
    StorageTree,
    GPUMenu,
  },
  data(){
    return{
      collapseIndex: '1', 
    }
  },
  mounted(){
    if (this.$route.fullPath.match('storage') && !this.$route.fullPath.match('cluster')) {
      this.collapseIndex = '2';
    } else if (this.$route.fullPath.match('gpu')) {
      this.collapseIndex = '3';
    }else {
      this.collapseIndex = '1';
    }
  },
  methods:{
    changeCollapse(val) {
      if (val == '2' && (!this.$route.fullPath.match('storage') || this.$route.fullPath.match('cluster'))) {
        this.$router.push('/storage')
      } else if(val == '3' && !this.$route.fullPath.match('gpu')){
        this.$router.push('/gpu/device')
      } else if (val == '1' && (this.$route.fullPath.match('storage') || this.$route.fullPath.match('gpu'))){
        this.$router.push('/cluster/summary');
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.menu{
  min-width: 270px;
  padding-left: 10px;
  height: 100%;
}
:deep(.el-collapse-item__header){
  height: 30px;
  padding: 0 10px
}
.collapse{
  overflow: hidden;
}
:deep(.el-collapse-item__wrap){
  overflow: auto;
}
:deep(.el-collapse-item__content){
  width: 270px;
  padding-bottom: 0px;
  overflow: hidden;
}
</style>
