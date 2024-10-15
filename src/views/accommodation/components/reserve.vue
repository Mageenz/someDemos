<template>
  <el-drawer
    title="新增订单"
    :visible.sync="visible"
    :before-close="handleClose"
    :size="700"
    :modal="false"
    append-to-body
    :z-index="2000"
  >
    <el-form :model="form" :rules="rules" ref="formRef" style="padding: 30px;">
      <div class="info">
        <h2>基本信息</h2>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <br />
            <el-form-item label="渠道" prop="from">
              <el-select v-model="form.from" placeholder="请选择渠道">
                <el-option label="美团" value="美团" />
                <el-option label="携程" value="携程" />
                <el-option label="飞猪" value="飞猪" />
                <el-option label="去哪儿" value="去哪儿" />
                <el-option label="同程" value="同程" />
                <el-option label="途牛" value="途牛" />
                <el-option label="驴妈妈" value="驴妈妈" />
                <el-option label="艺龙" value="艺龙" />
                <el-option label="飞猪" value="飞猪" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="info">
        <h2>房间信息</h2>
        <div class="room-info-item" v-for="(item, index) in form.roomInfo" :key="item.id">
          <div class="item-content">
            <el-date-picker class="ri-input" v-model="item.date" type="date" placeholder="日期" :clearable="false" />
            <el-popover placement="bottom" :width="100" trigger="click">
              <template #reference>
                <span class="ri-input">{{ item.night }}晚</span>
              </template>
              <el-input-number class="ri-input" v-model="item.night" :min="1" :max="10" />
            </el-popover>
            <el-cascader class="ri-input" v-model="item.roomType" placeholder="房间类型"></el-cascader>
            <el-input class="ri-input" v-model="item.price" placeholder="价格">
              <template #prefix>
                <span>￥</span>
              </template>
            </el-input>
          </div>
          <el-button type="primary" link @click="addPerson(index)">+入住人</el-button>
          <el-button type="danger" link @click="removeRoom(index)" v-if="form.roomInfo.length > 1">删除</el-button>
        </div>
        <el-button type="primary" link @click="addRoom">+新增房间</el-button>
      </div>

      <div class="info">
        <h2>消费信息</h2>
        <el-button type="primary" link>+添加消费</el-button>
      </div>

      <div class="info">
        <h2>收款信息</h2>
        <el-button type="primary" link>+添加收款</el-button>
      </div>

      <div class="info">
        <h2>订单提醒</h2>
        <el-button type="primary" link>+新增提醒</el-button>
      </div>

      <div class="info">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
      </div>
    </el-form>
    <div class="footer">
      <div class="order-amount">
        <span>订单金额：</span>
        <span>￥100.00</span>
      </div>
      <div style="display: flex;">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit">提交订单</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'Reserve',
  props: {
    roomTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      form: {
        name: '',
        phone: '',
        from: '',
        roomInfo: [
          {id: Date.now(),date: '', night: 1, roomType: '', price: ''}
        ]
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
      this.form.roomInfo = this.groupRoomInfo(roomInfo);

      console.log('translated', this.form.roomInfo);
    },
    // 根据所在行与列获取房间信息
    groupRoomInfo(roomInfo) {
      // 首先按房间号分组
      const roomGroups = this.groupByRoomNumber(roomInfo);
      console.log('roomGroups', roomGroups);
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
      this.$refs.formRef.validate(valid => {
        if(valid) {
          this.$message.success('提交成功');
          this.visible = false;
          this.$emit('submit', {
            ...this.form,
          });
        }
      })
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
    margin-bottom: 15px;
  }
  .room-info-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .item-content {
      display: flex;
      align-items: center;
      margin-right: 10px;
      >span {
        width: 40px !important;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border: 1px #dcdfe6 solid;
        border-right: none;
        cursor: pointer;
        &:hover {
          border: 1px #409eff solid !important;
        }
      }
      :deep(.ri-input) {
        width: 120px;
        height: 34px;
        .el-input__wrapper {
          border-radius: 0;
          border: 1px #dcdfe6 solid;
          border-right: none;
          box-shadow: none;
          &.is-focus {
            border: 1px #409eff solid !important;
          }
        }
        &:last-child {
          .el-input__wrapper {
            border-right: 1px #dcdfe6 solid;
          }
        }
      }
    }
  }
}
.footer {
  // border-top: 1px solid #ccc;
  padding: 30px;
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
