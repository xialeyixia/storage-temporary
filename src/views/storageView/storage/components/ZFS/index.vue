<template>
  <div class="storage-content">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="$t('common.pool')" name="pool">
        <Pool v-if="activeName == 'pool'"></Pool>
      </el-tab-pane>
      <el-tab-pane :label="$t('common.snapshot')" name="snapshot">
        <Snapshot v-if="activeName == 'snapshot'"></Snapshot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Pool from './pool.vue'
import Snapshot from './snapshot.vue'
export default {
  name: 'ZFS',
  components: {
    Pool,
    Snapshot
  },
  data(){
    return{
      activeName: 'pool'
    }
  },
  mounted(){

  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
.el-table--fit{
  border: 1px solid;
}
</style>
