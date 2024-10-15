<template>
  <div>
    <div class="date-container">
      <div class="date-picker">
        <div>日期选择></div>
        <div>
          <div>标间</div>
          <div>大床房</div>
          <div>家庭房</div>
        </div>
      </div>
      <div class="datelist-container">
        <div class="datelist">
          <div class="date-item" v-for="date in dateList" :key="date.getTime()">{{ date.getMonth() + 1 }}月{{ date.getDate() }}</div>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dateComponent',
  data() {
    return {
      date: new Date(),
      dateList: []
    }
  },
  mounted() {
    this.dateList = this.generateDateList();
  },
  methods: {
    generateDateList() {
      const list = [];
      const today = new Date();
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        list.push(date);
      }
      return list;
    }
  }
}
</script>

<style lang="less">
.date-container {
  display: flex;
  .date-picker {
    width: 260px;
  }
  .datelist-container {
    overflow: auto;
    width: 1401px;
    .datelist {
      display: flex;
      border: 1px solid#d5d9e3;
      border-right: 0;
      border-bottom: 0;
      .date-item {
        width: 140px;
        border-right: 1px solid#d5d9e3;
        box-sizing: border-box;
        font-size: 14px;
        padding-left: 10px;
        padding-top: 10px;
        height: 60px;
      }
    }
  }
}
</style>