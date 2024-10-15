<template>
  <div style="background: #f8f8f8; padding: 30px;">
    <div class="accommodation">
        <div class="tab-and-search">
          <el-tabs v-model="activeName">
            <el-tab-pane label="日历" name="canlendar"></el-tab-pane>
            <el-tab-pane label="单日" name="single"></el-tab-pane>
          </el-tabs>
          <div class="search">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="筛选条件" style="margin-bottom: 0;">
                <el-select v-model="searchForm.condition" placeholder="请选择">
                  <el-option label="没有女士" value="all"></el-option>
                  <el-option label="没有男士" value="reserved"></el-option>
                  <el-option label="没有小孩" value="checkedIn"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-bottom: 0;">
                <el-input v-model="searchForm.keyword" placeholder="姓名、手机号、订单号、房间号、备注" />
              </el-form-item>
              <el-form-item style="margin-bottom: 0 !important;">
                <el-button>批量置脏/净</el-button>
                <el-button>批量开/关房</el-button>
                <el-button type="primary">房价管理</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      <canlendar v-if="activeName === 'canlendar'" />
      <single v-if="activeName === 'single'" />
    </div>
  </div>
</template>

<script>
import Canlendar from './components/canlendar.vue';
import Single from './components/single.vue';

export default {
  name: 'accommodation',
  components: {
    Canlendar,
    Single
  },
  data() {
    return {
      activeName: 'canlendar',
      searchForm: {
        condition: '',
        keyword: ''
      }
    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.accommodation {
  background: #fff;
  padding: 15px 20px;
  border-radius: 5px;
}
.tab-and-search {
  position: relative;
  .search {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>