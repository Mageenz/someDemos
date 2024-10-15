<template>
  <div class="canlendar">
    <div class="canlendar-container">
      <div class="sidebar">
        <div class="date-picker">
          <div class="date-picker-item">
            <el-date-picker @change="handleDateChange" v-model="date" type="date" placeholder="选择日期" :clearable="false" prefix-icon="" style="width: 100px;" size="small" :editable="false" />
            <span v-if="isToday">今</span>
          </div>
          <div class="date-range" v-if="dateList.length > 0">
            <span><</span>
            <span>{{ dateList[0].formattedDate }} - {{ dateList[dateList.length - 1].formattedDate }}</span>
            <span>></span>
          </div>
        </div>
        <div class="filter">
          <div class="filter-item">
            <span>筛选</span>
            <el-icon><Filter /></el-icon>
          </div>
          <div class="filter-item" @click="handleCollapse">
            <span>{{ isCollapse ? '展开' : '收起' }}</span>
            <el-icon>
              <ArrowUp v-if="!isCollapse" />
              <ArrowDown v-else />
            </el-icon>
          </div>
        </div>
        <div class="room-type">
          <div class="room-type-item" v-for="type in roomTypeList" :key="type.name">
            <div class="text">
              <span>{{ type.name }}</span>
            </div>
            <div class="room-nums" v-if="!isCollapse">
              <div v-for="num in type.roomCode" :key="type.name + num" class="room-num">
                <div class="text">
                  <span>{{ num }}</span>
                </div>
                <div class="bed-list">
                  <div v-for="bed in type.bed" :key="`${num}_${bed}`" class="bed">床</div>
                </div>
              </div>
            </div>
            <div class="left-text" v-else>剩余</div>
          </div>
        </div>
      </div>
      <div class="datelist-container thin-scroll">
        <div class="datelist">
          <div :class="`date-item ${highlightedDate === date.formattedDate ? 'actived' : ''}`" v-for="date in dateList" :key="date.formattedDate">
            <div class="date-text">{{ date.formattedDate }} {{ date.weekday }}</div>
            <div class="left-num">还剩10间</div>
          </div>
        </div>
        <canlendar-grid ref="canlendarGrid" :roomTypeList="roomTypeList" :date-list="dateList" @hover-rect="handleHoverRect" :isCollapse="isCollapse" />
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import CanlendarGrid from './canlendarGrid.vue';

const priceList = [
  {date: dayjs().format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(1, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(2, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(3, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(4, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(5, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(6, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(7, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(8, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(9, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(10, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(11, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(12, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(13, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(14, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(15, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(16, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(17, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(18, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(19, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(20, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(21, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(22, 'day').format('YYYY-MM-DD'), price: 200},
  {date: dayjs().add(23, 'day').format('YYYY-MM-DD'), price: 200},
]

export default {
  name: 'canlendar',
  components: {
    CanlendarGrid
  },
  data() {
    return {
      date: dayjs().format('YYYY-MM-DD'),
      dateList: [],
      roomTypeList: [
        {
          name: '标间',
          roomCode: ['101', '102', '103'],
          priceList,
          bed: [1, 2]
        },
        {
          name: '大床房',
          roomCode: ['201', '202', '203', '204'],
          priceList,
          bed: [1]
        },
      ],
      highlightedDate: null,
      highlightedRoom: null,
      isCollapse: false // 收起状态
    }
  },
  computed: {
    isToday() {
      return this.date === dayjs().format('YYYY-MM-DD');
    },
  },
  created() {
    this.dateList = this.generateDateList();
  },
  methods: {
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$refs.canlendarGrid.calculateRoomCount(this.isCollapse);
    },
    handleDateChange(date) {
      this.date = date;
      this.dateList = this.generateDateList();
    },
    generateDateList() {
      const list = [];
      const today = dayjs(this.date);
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      for (let i = 0; i < 30; i++) {
        const date = today.add(i, 'day');
        const formattedDate = date.format('MM-DD');
        const weekday = weekdays[date.day()];
        list.push({
          date: date.toDate(),
          formattedDate: formattedDate,
          weekday: weekday
        });
      }
      return list;
    },
    handleHoverRect(rect) {
      if(!rect) {
        this.highlightedDate = null;
        this.highlightedRoom = null;
        return;
      }
      // 高亮日期和房号
      const dateIndex = rect.col;
      const roomIndex = rect.row;
      
      // 高亮日期
      if (this.dateList[dateIndex]) {
        this.highlightedDate = this.dateList[dateIndex].formattedDate;
      }
      
      // 高亮房号
      let roomCode = '';
      let currentIndex = 0;
      for (const type of this.roomTypeList) {
        if (roomIndex >= currentIndex && roomIndex < currentIndex + type.roomCode.length) {
          roomCode = type.roomCode[roomIndex - currentIndex];
          break;
        }
        currentIndex += type.roomCode.length;
      }
      this.highlightedRoom = roomCode;
    }
  }
}
</script>

<style lang="less" scoped>
.canlendar-container {
  display: flex;
  .sidebar {
    width: 260px;
    .date-picker {
      border: 1px solid#d5d9e3;
      padding-top: 3px;
      .date-picker-item {
        display: flex;
        align-items: center;
        justify-content: center;
        >span {
          background-color: #2846c9;
          color: #fff;
          padding: 0 5px;
          font-size: 12px;
        }
        :deep(.el-input__wrapper) {
          background-color: transparent;
          box-shadow: none;
          cursor: pointer;
        }
        :deep(.el-input__inner) {
          cursor: pointer;
          color: #000;
        }
      }
      .date-range {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #888;
        >span {
          margin: 0 5px;
        }
      }
    }
    .filter {
      display: flex;
      align-items: center;
      border: 1px solid#d5d9e3;
      border-top: none;
      .filter-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-right: 1px solid#d5d9e3;
        padding: 6px 0;
        >span {
          margin-right: 3px;
        }
        &:last-child {
          border-right: none;
        }
      }
    }
    .room-type {
      border: 1px solid#d5d9e3;
      border-bottom: none;
      border-top: none;
      .text {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid#d5d9e3;
      }
      .room-type-item {
        display: flex;
        justify-content: center;
        >span {
          flex: 1;
          text-align: center;
        }
        .room-nums {
          flex: 1;
          border-left: 1px solid#d5d9e3;
          .room-num {
            display: flex;
            &.actived {
              background: rgba(200, 200, 200, 0.3);
            }
            .room-num-text {
              flex: 1;
              /* border-right: 1px #d5d9e3 solid; */
              text-align: center;
            }

            .bed-list {
              flex: 1;
              border-left: 1px #d5d9e3 solid;
            }
            
            .bed {
              height: 52px;
              line-height: 52px;
              text-align: center;
              border-bottom: 1px #d5d9e3 solid;
            }
          }
        }
        .left-text {
          flex: 1;
          text-align: center;
          height: 52px;
          line-height: 52px;
          border-bottom: 1px #d5d9e3 solid;
          border-left: 1px #d5d9e3 solid;
        }
      }
    }
  }
  .datelist-container {
    overflow: auto;
    flex: 1;
    .datelist {
      display: flex;
      .date-item {
        width: 100px;
        border-top: 1px solid#d5d9e3;
        border-right: 1px solid#d5d9e3;
        box-sizing: border-box;
        font-size: 14px;
        flex-shrink: 0;
        .date-text {
          padding: 12px 0 12px 10px;
          border-bottom: 1px solid #d5d9e3;
        }
        .left-num {
          text-align: center;
          padding: 6px 0;
        }
        &.actived {
          background: rgba(200, 200, 200, 0.3);
        }
      }
    }
  }
}
.thin-scroll::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px;
  height: 8px;
}
.thin-scroll::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background: #a0a0a0;
}
.thin-scroll::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 5px;
  background: #f7f8fa;
}
</style>