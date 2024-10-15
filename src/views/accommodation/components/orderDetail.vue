<template>
  <el-drawer
    :with-header="false"
    v-model="visible"
    :before-close="handleClose"
    :size="700"
    :modal="false"
    append-to-body
    :z-index="2000"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="订单详情" name="1">
        <div class="info">
          <div class="flex items-center mb-5">
            <span class="font20 mr-2.5">{{ form.name }}</span>
            <el-tag type="primary">已预订</el-tag>
          </div>
          <div class="flex justify-between">
            <div>
              <div>订单金额</div>
              <div class="font20 text-blue-600">200.00</div>
            </div>

            <div>
              <div>已付金额</div>
              <div class="font20 text-blue-600">200.00</div>
            </div>
          </div>
        </div>

        <div class="info">
          <h2 class="mb-3">房间信息</h2>
          <div class="flex items-center justify-between border p-5 pr-20">
            <div>
              <div class="font18 mb-2">{{ form.roomType }}</div>
              <div class="text-gray-500">{{ form.dates[0] }} 至 {{ form.dates[form.dates.length - 1] }}，{{ form.dates.length }}晚</div>
            </div>
            <div class="text-blue-600">入住1人</div>
          </div>
        </div>

        <div class="info">
          <h2>消费信息：￥0.00</h2>
        </div>

        <div class="info">
          <h2>收款信息：￥200.00</h2>
        </div>

        <div class="info">
          <h2>订单提醒：0个</h2>
        </div>

        <div class="info">
          <div class="text-gray-500">订单号：xxxx</div>
          <div class="text-gray-500">订单来源：美团</div>
          <div class="text-gray-500">备注：迟点来</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="2"></el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="footer">
        <div class="order-amount"></div>
        <div style="display: flex;">
          <el-button @click="handleClose">取消预约</el-button>
          <el-button type="primary" @click="submit">修改订单</el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'OrderDetail',
  props: {
    roomTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      activeTab: '1',
      form: {
        name: '',
        phone: '',
        from: '',
        roomInfo: [
          {id: Date.now(),date: '', night: 1, roomType: '', price: ''}
        ],
        dates: []
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        // phone: [{ required: true, message: '请输入手机号', trigger: 'change' }],
        // from: [{ required: true, message: '请选择渠道', trigger: 'change' }]
      }
    }
  },
  methods: {
    open(roomInfo) {
      this.visible = true;
      this.form = roomInfo.orderInfo;
      // this.form.roomInfo = this.groupRoomInfo(roomInfo);
    },
    // 根据所在行与列获取房间信息
    groupRoomInfo(roomInfo) {
      // 首先按房间号分组
      const roomGroups = this.groupByRoomNumber(roomInfo);
      let groupedRooms = [];

      // 对每个房间号的组进行日期连续性处理
      for (const roomCode in roomGroups) {
        const roomGroup = roomGroups[roomCode];
        roomGroup.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

        let currentGroup = null;

        for (let room of roomGroup) {
          if (!currentGroup || !this.isConsecutiveDate(currentGroup.date[currentGroup.date.length - 1], room.date)) {
            // 开始新的分组
            currentGroup = {
              id: Date.now() + Math.random(),
              roomCode: room.roomCode,
              roomType: room.roomType,
              date: [room.date],
              night: 1,
              price: parseFloat(room.price),
              rects: [room.rect]
            };
            groupedRooms.push(currentGroup);
          } else {
            // 继续当前分组
            if(!currentGroup.date.includes(room.date)) {
              currentGroup.date.push(room.date);
              currentGroup.night++;
              currentGroup.price += parseFloat(room.price);
            }
            currentGroup.rects.push(room.rect);
          }
        }
      }
      // 处理日期和价格
      groupedRooms.forEach(group => {
        group.dates = group.date;
        group.date = group.date[0];
        group.price = group.price.toFixed(2);
      });

      return groupedRooms;
    },
    groupByRoomNumber(roomInfo) {
      return roomInfo.reduce((groups, room) => {
        if (!groups[room.roomCode]) {
          groups[room.roomCode] = [];
        }
        groups[room.roomCode].push(room);
        return groups;
      }, {});
    },
    isConsecutiveDate(date1, date2) {
      const d1 = dayjs(date1);
      const d2 = dayjs(date2);
      return d2.diff(d1, 'day') === 1 || d2.diff(d1, 'day') === 0;
    },
    handleClose() {
      this.visible = false;
      this.$emit('close');
    },
    addRoom() {
      this.form.roomInfo.push({id: Date.now(),date: '', night: '', roomType: '', price: ''});
    },
    removeRoom(index) {
      this.form.roomInfo.splice(index, 1);
    },
    submit() {
      this.$message.success('提交成功');
      this.visible = false;
      this.$emit('submit', {
        ...this.form,
      });
    }
  }
}
</script>

<style lang="less" scoped>
.info {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px dashed #ccc;
  >h2 {
    font-size: 18px;
  }
}
.footer {
  .order-amount {
    font-size: 14px;
    display: flex;
    >span:last-child {
      color: rgb(64, 80, 223);
    }
  }
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
