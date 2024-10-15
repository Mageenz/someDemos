<template>
  <div style="padding: 20px;">
    <el-row :gutter="40">
      <el-col :span="18" style="border-right: 1px solid #e5e5e5;">
        <div class="room-block">
          <h4>单人房（共4间）</h4>
          <el-row :gutter="18" class="room-list">
            <el-col :span="4" v-for="item in 4" :key="item">
              <div class="room-item-content">
                <div class="room-code">101</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="room-block">
          <h4>双人房（共4间）</h4>
          <el-row :gutter="18" class="room-list">
            <el-col :span="4" v-for="item in 4" :key="item">
              <div class="room-item-content">
                <div class="room-code">101</div>
                <div class="customer-list">
                  <div class="customer-item">
                    <span class="customer-name">张三</span>
                    <span class="customer-status">欠</span>
                    <span class="customer-status">离</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="room-block">
          <h4>三人房（共4间）</h4>
          <el-row :gutter="18" class="room-list">
            <el-col :span="4" v-for="item in 4" :key="item">
              <div class="room-item-content">
                <div class="room-code">101</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="search-block">
          <h2>日期选择</h2>
          <el-date-picker v-model="form.date" placeholder="开始日期"></el-date-picker>
        </div>

        <div class="search-block">
          <h2>房型筛选</h2>
          <h3>可销售/总房数：5/6</h3>
          <el-checkbox-group v-model="form.roomType">
            <div>
              <el-checkbox value="1" label="1">
                <span>单人房</span>
                <span>4/4</span>
              </el-checkbox>
            </div>
            <div>
              <el-checkbox value="2" label="2">
                <span>双人房</span>
                <span>4/4</span>
              </el-checkbox>
            </div>
            <div>
              <el-checkbox value="3" label="3">
                <span>三人房</span>
                <span>4/4</span>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <div class="search-block">
          <h2>房态选择</h2>
          <h3>共9间</h3>
          <el-checkbox-group v-model="form.roomStatus">
            <div class="flex">
              <el-checkbox value="1" label="1">
                <span>空脏</span>
                <span>4/4</span>
              </el-checkbox>
              <el-checkbox value="2" label="2">
                <span>双人房</span>
                <span>4/4</span>
              </el-checkbox>
            </div>
            <div class="flex">
              <el-checkbox value="3" label="3">
                <span>三人房</span>
                <span>4/4</span>
              </el-checkbox>
              <el-checkbox value="4" label="4">
                <span>三人房</span>
                <span>4/4</span>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Single',
  data() {
    return {
      form: {
        date: '',
        roomType: [],
        roomStatus: []
      }
    }
  }
}
</script>

<style scoped lang="less">
.room-block {
  >h4 {
    margin-bottom: 10px;
  }
  margin-bottom: 20px;
}
.room-item-content {
  height: 100px;
  position: relative;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 10px;
  .room-code {

  }
  .customer-list {
    .customer-item {
      .customer-name {
        margin-right: 5px;
      }
      .customer-status {
        background: red;
        color: #fff;
        padding: 2px;
        margin-right: 5px;
      }
    }
  }
}
.search-block {
  border-bottom: 1px solid #e5e5e5;
  padding: 20px 0;
  >h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  >h3 {
    font-size: 16px;
    color: #999;
    margin-bottom: 10px;
  }
  :deep(.el-checkbox) {
    width: 100%;
  }
  :deep(.el-checkbox__label) {
    display: inline-flex;
    flex: 1;
    >span:last-child {
      flex: 1;
      text-align: right;
    }
  }
}
</style>