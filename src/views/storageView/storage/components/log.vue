<template>
  <div class="storage-content">
    <el-button
      color="#579cdc"
      style="color: #fff"
      type="primary"
      size="small"
      @click="clearLog"
      >{{ $t('control.clearlog') }}</el-button
    >
    <div class="maincontents">
      <el-table
        :data="logData"
        v-loading="spinning"
        header-cell-class-name="table-header-row"
        element-loading-text="Loading..."
      >
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column
          :label="$t('table.time')"
          prop="time"
        ></el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          prop="operate"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('common.detailedInfo')"
          prop="msg"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('table.result')"
          prop="result"
          width="100"
          :formatter="
            (row, column, cellValue) => {
              if (cellValue == '0') return this.$t('common.success')
              else return this.$t('common.failure')
            }
          "
        ></el-table-column>
        <el-table-column fixed="right" width="100">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="deleteLog(scope.row)"
              >{{ $t('control.delete') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      hide-on-single-page="true"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      @current-change="onChangeSize"
    />
  </div>
</template>

<script>
export default {
  name: 'StorageLog',
  components: {},
  data() {
    return {
      spinning: false,
      logData: [],
      pageNum: 1,
      pageSize: 30,
      total: 0,
    }
  },
  watch: {
    '$route.query.ip'(val) {
      if (val) this.getLoglist()
    },
  },
  created() {
    this.getLogLength()
  },
  mounted() {
    this.getLoglist()
  },
  methods: {
    onChangeSize(num) {
      this.pageNum = num
      this.getLoglist()
    },
    getLogLength() {
      this.$api
        .get('/webapp/get_log_size?remote_ip=' + this.$route.query.ip)
        .then((res) => {
          if (res.state === 0) {
            this.total = res.params.size
          }
        })
        .catch(() => {})
    },
    getLoglist() {
      this.spinning = true
      this.$api
        .get(
          '/webapp/get_log?remote_ip=' +
            this.$route.query.ip +
            '&page=' +
            this.pageNum +
            '&pagerow=' +
            this.pageSize,
        )
        .then((res) => {
          this.spinning = false
          if (res.state == 0) {
            this.logData = res.params.list
          } else {
            this.$message.warning({
              message: (
                <div class="warning-message">
                  {res.message ? res.message : this.$t('common.errmsg')}
                </div>
              ),
            })
          }
        })
        .catch(() => {
          this.spinning = false
        })
    },
    deleteLog(row) {
      this.$messageBox
        .confirm('删除日志 - ' + row.id, this.$t('common.warning'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
        })
        .then(() => {
          this.$api
            .deletes('/webapp/delete_log?remote_ip=' + this.$route.query.ip, {
              id: row.id,
            })
            .then((res) => {
              if (res.state == 0) {
                this.$message.success(res.message)
                this.getLogLength()
                this.getLoglist()
              } else {
                this.$message.warning({
                  message: (
                    <div class="warning-message">
                      {res.message ? res.message : this.$t('common.errmsg')}
                    </div>
                  ),
                })
              }
            })
        })
    },
    clearLog() {
      this.$messageBox
        .confirm('清空所有日志', this.$t('common.warning'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
        })
        .then(() => {
          this.$api
            .deletes('/webapp/truncate_log?remote_ip=' + this.$route.query.ip)
            .then((res) => {
              if (res.state == 0) {
                this.$message.success(res.message)
                this.getLogLength()
                this.getLoglist()
              } else {
                this.$message.warning({
                  message: (
                    <div class="warning-message">
                      {res.message ? res.message : this.$t('common.errmsg')}
                    </div>
                  ),
                })
              }
            })
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-table--fit {
  border: 1px solid;
}
.storage-content {
  padding: 8px 10px 40px;
  box-sizing: border-box;
}
.maincontents {
  overflow: auto;
  height: calc(100% - 45px);
  box-sizing: border-box;
  margin-top: 8px;
}
</style>
