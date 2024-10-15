<template>
  <div class="summary-grid">
    <div class="summary-row" v-for="type in roomTypeList" :key="type.name">
      <div class="summary-cell" v-for="(date, index) in dateList" :key="date">
        {{ getRemainingRooms(type, index) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'summaryGrid',
  props: {
    roomTypeList: {
      type: Array,
      default: () => []
    },
    dateList: {
      type: Array,
      default: () => []
    },

  },
  data() {
    return {
    }
  },

  mounted() {
    this.generateDateList();
  },

  methods: {
    getRemainingRooms(roomType, dateIndex) {
      const date = this.dateList[dateIndex];
      const totalRooms = roomType.roomCode.length;
      let occupiedRooms = 0;

      roomType.roomCode.forEach((roomCode, roomIndex) => {
        const startRow = this.getStartRowForRoom(roomType, roomIndex);
        const bedCount = Math.max(roomType.bed.length, 1);
        
        for (let i = 0; i < bedCount; i++) {
          const key = `${startRow + i},${dateIndex}`;
          if (this.reservedRoom.has(key) || this.closedRoom.has(key)) {
            occupiedRooms++;
            break; // 如果房间的任何一张床被占用或关闭，就认为整个房间不可用
          }
        }
      });

      return totalRooms - occupiedRooms;
    },

    getStartRowForRoom(roomType, roomIndex) {
      let startRow = 0;
      for (const type of this.roomTypeList) {
        if (type === roomType) {
          return startRow + roomIndex * Math.max(type.bed.length, 1);
        }
        startRow += type.roomCode.length * Math.max(type.bed.length, 1);
      }
      return startRow;
    },
  }
}
</script>

<style lang="less" scoped>
.canlendar-grid {
  position: relative;
}

.summary-grid {
  margin-top: 10px;
  border-top: 1px solid #d5d9e3;
}

.summary-row {
  display: flex;
  border-bottom: 1px solid #d5d9e3;
}

.summary-cell {
  width: 100px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #d5d9e3;
  font-size: 14px;
}
</style>