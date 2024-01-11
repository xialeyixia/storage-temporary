<template>
  <div class="sensor-view" v-loading="loading">
    <el-table :data="sensorList" style="width: 100%" table-layout="auto">
      <el-table-column label="名称">
        <template #default="scope">
          {{ scope.row.name }}
          <el-tooltip v-if="scope.row.status === 'ok'" placement="top">
            <template #content>正常</template>
            <el-icon class="icon"><SuccessFilled /></el-icon>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 'nc'" placement="top">
            <template #content>告警</template>
            <el-icon class="warn"><WarningFilled /></el-icon>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 'cr'" placement="top">
            <template #content>严重</template>
            <el-icon class="danger"><CircleCloseFilled /></el-icon>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 'nr'" placement="top">
            <template #content> 不可恢复</template>
            <el-icon class="stop"><RemoveFilled /></el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="lower_warning" label="低警告阈值">
        <template #default="scope">
          {{
            scope.row.lower_warning !== null ? scope.row.lower_warning : 'NaN'
          }}
          {{ scope.row.unit === 'degrees C' ? '℃' : scope.row.unit }}
        </template>
      </el-table-column>
      <el-table-column prop="value" label="当前值">
        <template #default="scope">
          {{ scope.row.value !== null ? scope.row.value : 'NaN' }}
          {{ scope.row.unit === 'degrees C' ? '℃' : scope.row.unit }}
        </template>
      </el-table-column>
      <el-table-column prop="upper_warning" label="高警告阈值">
        <template #default="scope">
          {{
            scope.row.upper_warning !== null ? scope.row.upper_warning : 'NaN'
          }}
          {{ scope.row.unit === 'degrees C' ? '℃' : scope.row.unit }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  SuccessFilled,
  WarningFilled,
  CircleCloseFilled,
  RemoveFilled,
} from '@element-plus/icons-vue'
export default {
  data() {
    return {
      loading: false,
      sensorList: [],
    }
  },
  components: {
    SuccessFilled,
    WarningFilled,
    CircleCloseFilled,
    RemoveFilled,
  },
  watch: {
    '$route.query.ip'(val) {
      if (val) this.getAllSensor()
    },
  },
  created() {
    this.getAllSensor()
  },
  methods: {
    getAllSensor() {
      this.loading = true
      this.$api
        .get('/webapp/get_all_sensor', {}, true)
        .then((res) => {
          if (res.state === 0) {
            this.sensorList = res.params.list
          } else {
            this.$message.warning(res.message || this.$t('common.errmsg'))
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          this.$message.warning(err.message || this.$t('common.errmsg'))
        })
    },
  },
}
</script>
<style lang="scss">
.sensor-view {
  .el-table__body-wrapper {
    .el-table__body {
      .el-table__row {
        .icon {
          path {
            fill: #67c23a;
          }
        }
        .danger {
          path {
            fill: #f56c6c;
          }
        }
        .stop {
          path {
            fill: #c45656;
          }
        }
        .warn {
          path {
            fill: #e6a23c;
          }
        }
      }
    }
  }
}
</style>
