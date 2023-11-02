<template>
  <div class="storage-content">
    <!-- <el-tabs v-model="activeName" type="card"> -->
      <!-- <el-tab-pane :label="$t('storage.server')" name="server"> -->
      <Server v-if="activeName == 'server'"></Server>
      <!-- </el-tab-pane> -->
      <!-- <el-tab-pane :label="$t('storage.client')" name="client">
        <Client v-if="activeName == 'client'"></Client>
      </el-tab-pane> -->
    <!-- </el-tabs> -->
  </div>
</template>

<script>
import Server from './server.vue'
// import Client from './client.vue'
export default {
  name: 'iSCSI',
  components: {
    Server,
    // Client
  },
  data(){
    return{
      activeName: 'server'
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
