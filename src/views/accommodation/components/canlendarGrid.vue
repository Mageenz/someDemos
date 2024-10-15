<template>
  <div class="grid-container" ref="gridContainer" style="width: 3000px;">
    <canvas id="gridCanvas" class="ignore"></canvas>
    <div class="tooltip ignore" v-show="tooltipVisible" :style="tooltipStyle">
      <button @click="reserve">预订</button>
      <button @click="closeRoom">关房</button>
      <button @click="cancel">取消</button>
    </div>
    <div class="order-summary ignore" v-show="orderSummaryVisible" :style="orderSummaryVisibleStyle">
      <div class="flex items-center p-3 bg-gray-200">
        <span class="flex-1">101</span>
        <el-tag>已预订</el-tag>
      </div>
      <div class="p-3">
        <div class="flex items-center mb-3">
          <span>入住人：</span>
          <span>张三、李四</span>
        </div>
        <div class="flex items-center mb-3 pb-3 border-b">
          <span>09-21入住 | 09-22离店 | 共2晚</span>
        </div>
        <div class="flex items-center mb-3 pb-3 border-b">
          <span class="mr-5">订单总额：￥600.00</span>
          <span>已收款：￥600.00</span>
        </div>
        <div class="flex items-center">
          <span>备注：</span>
          <span>无</span>
        </div>
      </div>
    </div>
    <div class="temp-canvas ignore" ref="tempCanvas"></div>
    <reserve ref="reserve" :roomTypeList="roomTypeList" @submit="reserveSucceed" @close="cancel" />
    <order-detail ref="orderDetail" />
  </div>
</template>

<script>
/* eslint-disable */
import dayjs from 'dayjs';
import reserve from './reserve.vue'
import orderDetail from './orderDetail.vue';

export default {
  name: 'CanlendarGrid',
  components: {
    reserve,
    orderDetail
  },
  props: {
    roomTypeList: {
      type: Array,
      default: () => []
    },
    dateList: {
      type: Array,
      default: () => []
    },
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    line() {
      return this.roomTypeList.reduce((acc, cur) => {
        return acc + cur.roomCode.length * Math.max(cur.bed.length, 1);
      }, 0);
    }
  },
  data() {
    return {
      column: 30, // 列数

      canvas: null,
      rectWidth: 100, // 矩形宽度
      rectHeight: 52, // 矩形高度

      tooltipVisible: false,
      tooltipStyle: {
        top: '0px',
        left: '0px',
      },
      orderSummaryVisible: false,
      orderSummaryVisibleStyle: {
        top: '0px',
        left: '0px',
      },
      selectedRect: new Set(), // 选中的格子

      closedRoom: [], // 关闭的房间

      reservedRoom: [], // 预订的房间分组
      reservedRect: new Set(), // 预订的格子

      isDragging: false,

      summaryGridVisible: false,

      allOrderInfo: [
        {"name":"xx","from":"", roomInfo: [
          {"date":"2024-09-24","dates":["2024-09-24"],"night":1,"price":"200.00","roomType":"标间","roomCode":"101"}
        ]},
        {"name":"xxx","from":"", roomInfo: [
          {"date":"2024-09-25","dates":["2024-09-25", "2024-09-26", "2024-09-27"],"night":1,"price":"200.00","roomType":"标间","roomCode":"101"}
        ]},
        {"name":"xx.xx","from":"", roomInfo: [
          {"date":"2024-09-24","dates":["2024-09-24"],"night":1,"price":"200.00","roomType":"标间","roomCode":"101"}
        ]}
      ]
    }
  },
  mounted() {
    this.initCanvas();
    this.$nextTick(() => {
      this.initMouseEvent();      
    })
  },
  methods: {
    initCanvas() {
      this.canvas = document.getElementById('gridCanvas');
      this.canvas.width = 3000
      this.canvas.height = document.querySelector('.room-type').offsetHeight
      this.allOrderInfo.forEach(orderInfo => this.generateReservedRoomFromOrderInfo(orderInfo))
      this.drawCanlendarGrid()
    },
    // 绘制房态网格
    drawCanlendarGrid() {
      const ctx = this.canvas.getContext('2d');
      const gap = 5;

      // 绘制基础网格
      this.drawBaseGrid();

      // 绘制选中房间
      this.selectedRect.forEach(key => {

        const [row, col] = key.split(',').map(Number);
        const x = col * this.rectWidth;
        const y = row * this.rectHeight;

        // 绘制背景色
        ctx.fillStyle = '#b3c8ff';
        ctx.fillRect(x + gap, y + gap, this.rectWidth - gap * 2, this.rectHeight - gap * 2)

        // 绘制√
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.moveTo(x + this.rectWidth * 0.35, y + this.rectHeight * 0.5);
        ctx.lineTo(x + this.rectWidth * 0.45, y + this.rectHeight * 0.65);
        ctx.lineTo(x + this.rectWidth * 0.65, y + this.rectHeight * 0.35);
        ctx.stroke();
      });

      // 绘制关房房间
      this.closedRoom.forEach(room => {
        // 绘制背景
        ctx.fillStyle = '#ccc'; // 灰色
        ctx.fillRect(room.x + gap, room.y + gap, room.width - gap * 2, room.height - gap * 2)
        ctx.fillStyle = '#2E5CF6';
        ctx.fillRect(room.x + gap, room.y + gap, gap, room.height - gap * 2)
        // 绘制文案
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.fillText('关房', room.x + this.rectWidth / 2 - gap * 3, room.y + this.rectHeight + gap);
      });

      // 绘制预订房间（按分组绘制）
      this.reservedRoom.forEach(room => {
        // 绘制背景
        ctx.fillStyle = '#ffd568';
        ctx.fillRect(room.x + gap, room.y + gap, room.width - gap * 2, room.height - gap * 2);
        
        ctx.fillStyle = '#2E5CF6';
        ctx.fillRect(room.x + gap, room.y + gap, gap, room.height - gap * 2)

        // 绘制文案
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(room.orderInfo.name, room.x + gap * 4, room.y + gap * 4);
        ctx.fillText(room.orderInfo.from, room.x + gap * 4, room.y + gap * 8);
      });
    },
    // 绘制基础网格
    drawBaseGrid() {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.lineWidth = 1
      for (let j = 0; j <= this.column; j++) {
        const x = j * this.rectWidth;
        ctx.beginPath();
        ctx.moveTo(x - 0.5, 0);
        ctx.lineTo(x - 0.5, this.line * this.rectHeight);
        ctx.strokeStyle = '#d5d9e3';
        ctx.stroke();
      }
      // 绘制水平线
      for (let i = 0; i <= this.line; i++) {
        const y = i * this.rectHeight;
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(this.column * this.rectWidth, y + 0.5);
        ctx.strokeStyle = '#d5d9e3';
        ctx.stroke();
      }
    },
    // 处理鼠标事件，包括拖拽，点击，悬浮等
    initMouseEvent() {
      let isSelectting = false;
      let startRect = null;
      let lastSelectedRect = null;
      let tempCanvas = null;
      let draggedShape = null;
      let startOffsetX = null;
      let startOffsetY = null;

      this.canvas.addEventListener('mousedown', (e) => {
        if(this.isCollapse) {
          return;
        }
        const rect = this.getRectFromCoords(e.offsetX, e.offsetY);
        const key = `${rect.row},${rect.col}`;
        const matchedShape = this.reservedRoom.find(item => item.rects.has(key));

        startRect = lastSelectedRect = this.getRectFromCoords(e.offsetX, e.offsetY);
        startOffsetX = e.offsetX
        startOffsetY = e.offsetY

        if (matchedShape) {
          // 处理拖拽逻辑
          this.isDragging = true;
          draggedShape = matchedShape;
          // 创建跟随鼠标的形状
          tempCanvas = this.createDragCanvas(draggedShape);
        } else if (this.closedRoom.find(room => room.rects.has(key))) {
          return;
        } else {
          // 处理选择逻辑
          isSelectting = true;
          this.toggleRectSelection(startRect);
          this.tooltipVisible = false;
        }
      });

      this.canvas.addEventListener('mousemove', (e) => {
        if(this.isCollapse) {
          return;
        }
        const currentRect = this.getRectFromCoords(e.offsetX, e.offsetY);

        if (this.isDragging) {
          // 处理拖拽逻辑
          this.hoverRect(currentRect);
          this.orderSummaryVisible = false

          // 跟随
          this.$refs.tempCanvas.style.display = 'block';
          this.$refs.tempCanvas.style.left = `${e.clientX - 15}px`;
          this.$refs.tempCanvas.style.top = `${e.clientY - 15}px`;
        } else if (isSelectting) {
          // 处理选择逻辑
          this.orderSummaryVisible = false

          if (currentRect.row !== startRect.row || currentRect.col !== startRect.col) {
            this.toggleRectSelection(currentRect);
            startRect = currentRect;
            lastSelectedRect = currentRect;
          }
        } else if(this.reservedRoom.find(room => room.rects.has(`${currentRect.row},${currentRect.col}`))) {
          // 处理hover到选中房间上的效果
          const roomInfo = this.reservedRoom.find(room => room.rects.has(`${currentRect.row},${currentRect.col}`))
          
          this.orderSummaryVisible = true
          this.orderSummaryVisibleStyle = {
            top: roomInfo.y + 'px',
            left: roomInfo.x + roomInfo.width + 'px',
          }
        } else {
          // 处理鼠标hover效果
          this.orderSummaryVisible = false
          this.hoverRect(currentRect);
        }
      });

      this.canvas.addEventListener('mouseup', (e) => {
        if(this.isCollapse) {
          return;
        }

        if (this.isDragging) {
          // 处理结束拖拽逻辑，从目标位置开始，按之前预订的形状画一个形状
          const endRect = this.getRectFromCoords(e.offsetX, e.offsetY); // 目标位置

          // 判断目标位置是否可以放置
          if(endRect.row === startRect.row && endRect.col === startRect.col) {
            // 原位置
            this.isDragging = false;
            tempCanvas.cleanup();
          } else if(this.closedRoom.find(room => room.rects.has(`${endRect.row},${endRect.col}`))) {
            // 关房冲突
            this.isDragging = false;
            tempCanvas.cleanup();
          } else if(this.reservedRoom.find(room => room.rects.has(`${endRect.row},${endRect.col}`))) {
            // 预订冲突
            this.isDragging = false;
            tempCanvas.cleanup();
            return
          } else {
            // 计算新的矩形位置和大小
            const newShape = {
              x: endRect.col * this.rectWidth,
              y: endRect.row * this.rectHeight,
              width: draggedShape.width,
              height: draggedShape.height,
              rects: new Set(),
              orderInfo: draggedShape.orderInfo
            };

            // 替换reservedRoom中的shape
            const index = this.reservedRoom.findIndex(shape => shape === draggedShape);
            if (index !== -1) {
              this.reservedRoom[index] = newShape;
            }

            // 更新reservedRect，添加新的矩形序号
            for (let i = 0; i < draggedShape.height / this.rectHeight; i++) {
              for (let j = 0; j < draggedShape.width / this.rectWidth; j++) {
                const key = `${endRect.row + i},${endRect.col + j}`;
                this.reservedRect.add(key);
                newShape.rects.add(key);
              }
            }
            // 更新reservedRect，移除旧的矩形序号
            draggedShape.rects.forEach(key => {
              if(!newShape.rects.has(key)) {
                this.reservedRect.delete(key)
              }
            })

            // 重新绘制画布
            this.drawCanlendarGrid();
            this.isDragging = false;
            tempCanvas.cleanup();
          }
        } else {
          // 处理停止选择逻辑
          isSelectting = false;
          if (lastSelectedRect && this.selectedRect.size > 0) {
            this.tooltipVisibleAtRect(lastSelectedRect);
          }
        }

        if (e.offsetX === startOffsetX && e.offsetY === startOffsetY) {
          // 处理点击逻辑
          const rect = this.getRectFromCoords(e.offsetX, e.offsetY);
          const key = `${rect.row},${rect.col}`;
          const reservedRoomInfo = this.reservedRoom.find(room => room.rects.has(key))
          if (reservedRoomInfo) {
            // 点击的是已预订的房间
            // this.clickReservedRoom(rect);
            console.log(`点击了预订的房间：${key}`);
            this.$refs.orderDetail.open(reservedRoomInfo);
          } else if(this.closedRoom.find(room => room.rects.has(key))) {
            // 点击的是已关房的房间
            // this.clickClosedRoom(rect);
            console.log(`点击了关闭的房间：${key}`);
          }
        }
      });

      this.$refs.gridContainer.addEventListener('mouseleave', (e) => {
        if(this.isCollapse) {
          return;
        }
        this.$emit('hover-rect', null);
        // 取消拖拽状态
        this.isDragging = false;
        
        // 隐藏临时画布
        this.$refs.tempCanvas.style.display = 'none';
        
        // 重置鼠标按下状态
        isSelectting = false;
        
        // 重绘画布，恢复原始状态
        this.drawCanlendarGrid();
      });
    },
    // 绘制房间剩余数量
    drawSummaryGrid() {
      const ctx = this.canvas.getContext('2d');      
      const gap = 5;
      this.canvas.width = 3000
      this.canvas.height = document.querySelector('.room-type').offsetHeight
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.roomTypeList.forEach((type, typeIndex) => {
        this.dateList.forEach((date, dateIndex) => {
          let total = type.roomCode.length

          // 根据预订的房间信息，计算剩余房间数
          this.reservedRoom.forEach(room => {
            if(type.roomCode.includes(room.orderInfo.roomCode) && room.orderInfo.dates.includes(dayjs(date.date).format('YYYY-MM-DD'))) {
              total--;
            }
          })

          const x = dateIndex * this.rectWidth;
          const y = typeIndex * this.rectHeight;

          // 绘制边框
          ctx.beginPath();
          ctx.moveTo(x - 0.5, y + 0.5);
          ctx.lineTo(x + this.rectWidth - 0.5, y + 0.5);
          ctx.lineTo(x + this.rectWidth - 0.5, y + this.rectHeight + 0.5);
          ctx.strokeStyle = '#d5d9e3';
          ctx.stroke();

          // 绘制文案
          ctx.fillStyle = 'black';
          ctx.font = '14px Arial';
          ctx.fillText(`${total}间`, x + this.rectWidth / 2 - gap, y + this.rectHeight / 2 + gap);
        });
      });
    },
    // 计算各类型房间剩余间数
    calculateRoomCount(isCollapse) {
      this.$nextTick(() => {
        if(isCollapse) {
          this.drawSummaryGrid()
        } else {
          this.drawCanlendarGrid()
        }
      })
    },
    // 生成一个临时的canvas跟随鼠标，用于拖拽效果
    createDragCanvas(shape) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = shape.width;
      tempCanvas.height = shape.height;
      const tempCtx = tempCanvas.getContext('2d');

      tempCtx.fillStyle = '#ffd568';
      tempCtx.fillRect(0, 0, shape.width, shape.height);

      tempCanvas.style.position = 'absolute';
      tempCanvas.style.pointerEvents = 'none';
      this.$refs.tempCanvas.appendChild(tempCanvas);

      return {
        canvas: tempCanvas,
        cleanup: () => {
          this.$refs.tempCanvas.removeChild(tempCanvas);
          this.$refs.tempCanvas.style.display = 'none';
        }
      };
    },
    // 鼠标悬浮高亮效果
    hoverRect({ row, col }) {
      const key = `${row},${col}`;
      const gap = 6;
      if (this.selectedRect.has(key) || this.reservedRoom.find(room => room.rects.has(key)) || this.closedRoom.find(room => room.rects.has(key))) {
        // 如果是预订或已选中的矩形，不进行高亮
        this.drawCanlendarGrid();
        this.$emit('hover-rect', null);
        return;
      }

      // 重绘整个画布以清除之前的高亮
      this.drawCanlendarGrid(); 

      const ctx = this.canvas.getContext('2d');
      const x = col * this.rectWidth;
      const y = row * this.rectHeight;

      // 绘制十字高亮效果
      for(let i = 0; i < this.line; i++) {
        if(i !== row) {
          // 绘制灰色背景
          const vy = i * this.rectHeight;
          ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
          ctx.fillRect(x, vy, this.rectWidth, this.rectHeight);
        } else {
          // 获取当前房型信息
          let roomInfo = this.getRoomInfoByRect(row, col);
          // console.log('roomInfo', roomInfo);
          // 绘制文案
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.font = '12px Arial';
          ctx.fillText(roomInfo.roomType, x + gap * 2, y + gap * 3);
          ctx.fillText(roomInfo.roomCode, x + gap * 2, y + gap * 5.5);
          // ctx.fillText(`￥${roomInfo.price}`, x + gap * 2, y + gap * 8);
        }
      }

      for(let i = 0; i < this.column; i++) {
        if(i !== col) {
          const vx = i * this.rectWidth;
          ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
          ctx.fillRect(vx, y, this.rectWidth, this.rectHeight);
        }
      }
      this.$emit('hover-rect', { row, col });
    },
    // 在选中矩形的右侧显示tooltip
    tooltipVisibleAtRect({ row, col }) {
      const x = (col + 1) * this.rectWidth; // 在矩形右侧显示
      const y = row * this.rectHeight;

      this.tooltipStyle = {
        top: `${y}px`,
        left: `${x}px`,
      };
      this.tooltipVisible = true;
    },
    // 根据坐标获取矩形
    getRectFromCoords(x, y) {
      const col = Math.floor(x / this.rectWidth);
      const row = Math.floor(y / this.rectHeight);
      return { row, col };
    },
    // 处理选中房间
    toggleRectSelection({ row, col }) {
      const key = `${row},${col}`;

      // 如果矩形已经被预约，不做任何改变
      if (this.reservedRoom.find(room => room.rects.has(key)) || this.closedRoom.find(room => room.rects.has(key))) {
        return;
      }

      if (this.selectedRect.has(key)) {
        this.selectedRect.delete(key);
      } else {
        this.selectedRect.add(key);
      }
      this.drawCanlendarGrid();
    },
    // 预约
    reserve() {
      if (this.selectedRect.size === 0) {
        return;
      }
      // 生成房间信息
      const roomInfo = Array.from(this.selectedRect).map(key => {
        const [row, col] = key.split(',').map(Number);
        const roomInfo = this.getRoomInfoByRect(row, col);

        return roomInfo;
      });

      console.log('reserve ----> roomInfo', roomInfo);
      this.tooltipVisible = false;
      this.$refs.reserve.open(roomInfo);
    },
    // 根据行列号获取对应的房间信息
    getRoomInfoByRect(row, col) {
      let currentIndex = 0;
      for (const type of this.roomTypeList) {
        const roomCount = type.roomCode.length;
        const bedCount = type.bed.length;
        const typeRows = roomCount * bedCount;
        
        if (row >= currentIndex && row < currentIndex + typeRows) {
          const roomIndex = Math.floor((row - currentIndex) / bedCount);
          const bedIndex = (row - currentIndex) % bedCount;
          
          const roomCode = type.roomCode[roomIndex];
          const roomType = type.name;
          const date = this.getDateByColumn(col);
          const price = type.priceList.find(item => item.date === date).price;
          // 获取该房间下所有bed的rect
          const bedRects = [];
          for (let i = 0; i < bedCount; i++) {
            const bedRow = currentIndex + roomIndex * bedCount + i;
            bedRects.push({row: bedRow, col});
          }
          return {roomCode, roomType, price, date, bed: type.bed[bedIndex], rect: {row, col}, bedRects};
        }
        
        currentIndex += typeRows;
      }
      return null; // 如果没有找到匹配的房间
    },
    // 获取日期
    getDateByColumn(col) {
      return dayjs(this.date).add(col, 'day').format('YYYY-MM-DD');
    },
    // 预约成功后
    reserveSucceed(orderInfo) {
      this.generateReservedRoomFromOrderInfo(orderInfo);

      // 清空选中的房间
      this.selectedRect.clear();

      // 隐藏tooltip
      this.tooltipVisible = false;

      // 重绘画布
      this.drawCanlendarGrid();
    },
    // 关房
    closeRoom() {
      if (this.selectedRect.size === 0) {
        return;
      }
      // 获取房间信息
      const roomInfo = Array.from(this.selectedRect).map(key => {
        const [row, col] = key.split(',').map(Number);
        return this.getRoomInfoByRect(row, col);
      });
      // 对房间信息进行去重
      const uniqueRoomInfo = roomInfo.reduce((acc, current) => {
        const isDuplicate = acc.some(item => 
          item.roomCode === current.roomCode && 
          item.date === current.date
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      console.log('roomInfo', roomInfo, uniqueRoomInfo);

      uniqueRoomInfo.forEach(item => {
        const group = this.generateShapeFromRects(item.bedRects);
        
        this.closedRoom.push(group);
      })
      this.selectedRect.clear();
      this.tooltipVisible = false;
      this.drawCanlendarGrid();
    },
    // 取消
    cancel() {
      this.selectedRect.clear();
      this.drawCanlendarGrid();
      this.tooltipVisible = false;
    },
    // 根据订单中的房间预订信息绘制预订的形状
    generateReservedRoomFromOrderInfo(orderInfo) {
      orderInfo.roomInfo.forEach(room => {
        let rects = []
        const beinCol = this.dateList.findIndex(d => dayjs(d.date).format('YYYY-MM-DD') === room.dates[0]) // 开始列
        const endCol = this.dateList.findIndex(d => dayjs(d.date).format('YYYY-MM-DD') === room.dates[room.dates.length - 1]) // 结束列

        let startRow = 0 // 计数器
        let beginRow = 0; // 开始行
        let endRow = 0; // 结束行

        this.roomTypeList.forEach((roomType, typeIndex) => {
          let matched = false
          let bedCount = roomType.bed.length
          let typeRows = roomType.roomCode.length * bedCount

          roomType.roomCode.forEach((code, codeIndex) => {
            if(code === room.roomCode) {
              if(room.isAll) {
                // 包房，占据当前房间的所有行
                beginRow = startRow + (codeIndex + 1) * bedCount - bedCount
                endRow = startRow + (codeIndex + 1) * bedCount - 1
              } else {
                // 不包房，占据当前房间的一张床位，需判断占据哪张床位

                // 从所有订单信息中找出与当前房间的房号相同且日期重叠的所有订单信息
                const temp = this.reservedRoom.filter(item => item.orderInfo.roomCode === room.roomCode && item.orderInfo.dates.some(d => room.dates.includes(d)))
                if(temp && temp.length > 0) {
                  // 如果有订单信息，从订单信息中寻找最大的行号，从该行号开始
                  const maxRow = temp.reduce((acc, current) => {
                    return Math.max(acc, Array.from(current.rects)[0].split(',')[0])
                  }, 0)
                  beginRow = maxRow + 1
                  endRow = maxRow + 1
                } else {
                  beginRow = startRow + (codeIndex + 1) * bedCount - bedCount
                  endRow = startRow + (codeIndex + 1) * bedCount - bedCount
                }
              }
              matched = true
            }
          })
          if(!matched) {
            // 没匹配到房号，从下个房型的第一个序号开始
            startRow = typeIndex + typeRows
          }
        })

        for(let i = beinCol; i <= endCol; i++ ) {
          for(let j = beginRow; j <= endRow; j++) {
            rects.push({
              row: j,
              col: i
            })
          }
        }

        const shape = this.generateShapeFromRects(rects)
        shape.orderInfo = {
          name: orderInfo.name,
          from: orderInfo.from,
          date: room.date,
          dates: room.dates,
          night: room.night,
          price: room.price,
          roomType: room.roomType,
          roomCode: room.roomCode,
        }
        this.reservedRoom.push(shape);

        rects.forEach(rect => {
          this.reservedRect.add(`${rect.row},${rect.col}`);
        })
      })
    },
    //生成预订的形状
    generateShapeFromRects(rects) {
      // 计算边界
      const minCol = Math.min(...rects.map(r => r.col));
      const maxCol = Math.max(...rects.map(r => r.col));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
      const minRow = Math.min(...rects.map(r => r.row));
      const maxRow = Math.max(...rects.map(r => r.row));
      const x = minCol * this.rectWidth;
      const y = minRow * this.rectHeight;
      const width = (maxCol - minCol + 1) * this.rectWidth;
      const height = (maxRow - minRow + 1) * this.rectHeight;

      // 更新reservedRoomGroup和reservedRoom
      const shape = { x, y, width, height, rects: new Set() };
      rects.forEach(block => {
        const key = `${block.row},${block.col}`;
        
        shape.rects.add(key);
      });
      return shape;
    }
  },
}
</script>

<style scoped lang="less">
.grid-container {
  border-bottom: 1px solid #d5d9e3;
  position: relative;
}
#gridCanvas  {
  cursor: pointer;
}
.tooltip {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #000;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  border-radius: 5px;
  >button {
    color: #fff;
  }
  ::before {
    content: '';
    width: 0;
    height: 0;
    border: 4px solid transparent;
    border-right-color: #000;
    position: absolute;
    top: 5px;
    left: -8px;
  }
}
.order-summary {
  position: absolute;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  border-radius: 5px;
  background: #fff;
}
.temp-canvas {
  position: fixed;
  top: 0;
  left: 0;
  display: none;
}
</style>
