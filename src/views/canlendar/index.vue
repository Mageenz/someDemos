<template>
  <div class="" style="padding: 50px;">
    <date-component>
      <canvas id="canvas" class="ignore" @click="handleCanvasClick"></canvas>
    </date-component>
    <div class="tooltip ignore" v-show="showTooltip" :style="tooltipStyle">
      <button @click="handleReserve">预订</button>
      <button @click="handleCloseRoom">关房</button>
      <button @click="handleCancel">取消</button>
    </div>
    <div class="temp-canvas ignore" ref="tempCanvas"></div>
  </div>
</template>

<script>
/* eslint-disable */
import DateComponent from './date.vue'

export default {
  name: 'canlendarComponent',
  components: {
    DateComponent
  },
  data() {
    return {
      line: 6, // 行数
      column: 14, // 列数

      canvas: null,
      rectWidth: 0, // 矩形宽度
      rectHeight: 0, // 矩形高度

      showTooltip: false,
      tooltipStyle: {
        top: '0px',
        left: '0px',
      },
      selectedRoom: new Set(), // 选中的房间

      closedRoom: new Set(), // 关房的房间

      reservedRoomGroup: [], // 预订的房间分组
      reservedRoom: new Set(), // 预订的房间

      isDragging: false,
      isMouseDown: false
    }
  },
  mounted() {
    this.drawRectangles();
    this.$nextTick(() => {
      this.handleMouseEvents();
    })
  },
  beforeDestroy() {
    document.body.removeEventListener('mousemove', this.reset)
  },
  methods: {
    drawRectangles() {
      this.canvas = document.getElementById('canvas');
      this.canvas.width = 1400
      this.canvas.height = 400

      const ctx = this.canvas.getContext('2d');
      const width = this.canvas.width;
      const height = this.canvas.height;

      // 计算每个矩形的宽度和高度
      this.rectWidth = width / this.column;
      this.rectHeight = height / this.line;

      // 绘制矩形
      for (let i = 0; i < this.line; i++) {
        for (let j = 0; j < this.column; j++) {
          const x = j * this.rectWidth;
          const y = i * this.rectHeight;


          // 设置线条宽度为1像素
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#d5d9e3';
          // 使用translate来确保1像素边框
          ctx.translate(0.5, 0.5);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + this.rectWidth, y);
          ctx.lineTo(x + this.rectWidth, y + this.rectHeight);
          ctx.stroke();
          
          // 重置变换
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
    },
    redrawCanvas() {
      // 清除画布
      const ctx = this.canvas.getContext('2d');
      const gap = 5;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // 绘制基础网格
      this.drawRectangles();

      
      // 绘制选中房间
      ctx.fillStyle = '#b3c8ff';  // 淡蓝色
      this.selectedRoom.forEach(key => {
        const [row, col] = key.split(',').map(Number);
        const x = col * this.rectWidth;
        const y = row * this.rectHeight;
        ctx.fillRect(x, y, this.rectWidth, this.rectHeight)
      });

      // 绘制关房房间
      this.closedRoom.forEach(key => {
        const [row, col] = key.split(',').map(Number);
        const x = col * this.rectWidth;
        const y = row * this.rectHeight;

        // 绘制灰色背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // 灰色
        ctx.fillRect(x + gap, y + gap, this.rectWidth - gap * 2, this.rectHeight - gap * 2)

        // 绘制文案
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.fillText('关房', x + this.rectWidth / 2 - gap * 2, y + this.rectHeight / 2);
      });

      // 绘制预订房间（按分组绘制）
      this.reservedRoomGroup.forEach(group => {
        // 绘制形状
        ctx.fillStyle = '#ffd568'; // 黄色
        ctx.fillRect(group.x + gap, group.y + gap, group.width - gap * 2, group.height - gap * 2);
        
        // 绘制文案
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText('Michael Jackson', group.x + gap * 4, group.y + gap * 4);
        ctx.fillText('自来客', group.x + gap * 4, group.y + gap * 8);
      });
    },
    handleMouseEvents() {
      let startRect = null;
      let lastSelectedRect = null;
      let draggedShape = null;
      let tempCanvas = null;

      this.canvas.addEventListener('mousedown', (e) => {
        const rect = this.getRectFromCoords(e.offsetX, e.offsetY);
        const key = `${rect.row},${rect.col}`;
        const matchedShape = this.reservedRoomGroup.find(item => item.rects.has(key));

        if (matchedShape) {
          this.isDragging = true;
          draggedShape = matchedShape;
          // 创建跟随拖拽canvas
          tempCanvas = this.createDragCanvas(draggedShape);
        } else if (this.closedRoom.has(key)) {
          return;
        } else {
          // 选择房间
          this.isMouseDown = true;
          startRect = lastSelectedRect = this.getRectFromCoords(e.offsetX, e.offsetY);
          this.toggleRectSelection(startRect);
          this.showTooltip = false;
        }
      });

      this.canvas.addEventListener('mousemove', (e) => {
        if (this.isDragging) {
          // 处理拖拽逻辑
          const currentRect = this.getRectFromCoords(e.offsetX, e.offsetY);
          this.hoverRect(currentRect);

          // 跟随
          this.$refs.tempCanvas.style.display = 'block';
          this.$refs.tempCanvas.style.left = `${e.clientX - 15}px`;
          this.$refs.tempCanvas.style.top = `${e.clientY - 15}px`;

        } else if (this.isMouseDown) {
          const currentRect = this.getRectFromCoords(e.offsetX, e.offsetY);
          if (currentRect.row !== startRect.row || currentRect.col !== startRect.col) {
            this.toggleRectSelection(currentRect);
            startRect = currentRect;
            lastSelectedRect = currentRect;
          }
        } else {
          // 添加鼠标hover效果
          const currentRect = this.getRectFromCoords(e.offsetX, e.offsetY);
          this.hoverRect(currentRect);
        }
      });

      this.canvas.addEventListener('mouseup', (e) => {
        if (this.isDragging) {
          // 结束拖拽时，从目标位置开始重新画一个大矩形,后续需要判断目标位置是否能放置
          const endRect = this.getRectFromCoords(e.offsetX, e.offsetY);
          const isCanPut = true;
          
          if(isCanPut) {
            // 计算新的矩形位置和大小
            const newShape = {
              x: endRect.col * (this.canvas.width / this.column),
              y: endRect.row * (this.canvas.height / this.line),
              width: draggedShape.width,
              height: draggedShape.height,
              rects: new Set()
            };

            // 更新reservedRoomGroup数组
            const index = this.reservedRoomGroup.findIndex(shape => shape === draggedShape);
            if (index !== -1) {
              this.reservedRoomGroup[index] = newShape;
            }

            // 更新reservedRoom集合,添加新的矩形序号
            for (let i = 0; i < draggedShape.height / this.rectHeight; i++) {
              for (let j = 0; j < draggedShape.width / this.rectWidth; j++) {
                const key = `${endRect.row + i},${endRect.col + j}`;
                this.reservedRoom.add(key);
                newShape.rects.add(key);
              }
            }
            // 移除旧的矩形序号
            draggedShape.rects.forEach(key => {
              if(!newShape.rects.has(key)) {
                this.reservedRoom.delete(key)
              }
            })

            // 重新绘制画布
            this.redrawCanvas();
            this.isDragging = false;

            this.$refs.tempCanvas.style.display = 'none';
            tempCanvas.cleanup();
            tempCanvas = null;
          }

        } else {
          // 原有的mouseup逻辑
          this.isMouseDown = false;
          if (lastSelectedRect && this.selectedRoom.size > 0) {
            this.showTooltipAtRect(lastSelectedRect);
          }
        }
      });

      document.body.addEventListener('mousemove', this.reset);
    },
    reset(e) {
      if(e.target.closest('.ignore')) {
        return
      }
      // 取消拖拽状态
      this.isDragging = false;
      
      // 隐藏临时画布
      if(this.$refs.tempCanvas) {
        this.$refs.tempCanvas.style.display = 'none';
      }
      
      // 重置鼠标按下状态
      this.isMouseDown = false;
      
      // 重绘画布，恢复原始状态
      this.redrawCanvas();
    },
    // 拖拽过程中，根据拖拽对象，生成一个临时的canvas跟随鼠标
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
        }
      };
    },
    // 鼠标悬浮高亮效果
    hoverRect({ row, col }) {
      const key = `${row},${col}`;
      const gap = 5;

      if (this.reservedRoom.has(key) || this.selectedRoom.has(key) || this.closedRoom.has(key)) {
        return; // 如果是预订或已选中的矩形，不进行高亮
      }
      // 重绘整个画布以清除之前的高亮
      this.redrawCanvas(); 

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
          // 绘制文案
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.font = '12px Arial';
          ctx.fillText('标准间', x + gap * 2, y + gap * 4);
          ctx.fillText('102', x + gap * 2, y + gap * 8);
          ctx.fillText('￥102', x + gap * 2, y + gap * 12);
        }
      }

      for(let i = 0; i < this.column; i++) {
        if(i !== col) {
          const vx = i * this.rectWidth;
          ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
          ctx.fillRect(vx, y, this.rectWidth, this.rectHeight);
        }
      }
    },
    showTooltipAtRect({ row, col }) {
      const x = (col + 1) * this.rectWidth; // 在矩形右侧显示
      const y = row * this.rectHeight;
      const extraLeft = document.querySelector('.date-picker').offsetWidth
      const extraTop = document.querySelector('.datelist').offsetHeight

      this.tooltipStyle = {
        top: `${y + extraTop}px`,
        left: `${x + extraLeft}px`,
      };
      this.showTooltip = true;
    },
    // 根据坐标获取矩形
    getRectFromCoords(x, y) {
      const col = Math.floor(x / this.rectWidth);
      const row = Math.floor(y / this.rectHeight);
      return { row, col };
    },
    toggleRectSelection({ row, col }) {
      const ctx = this.canvas.getContext('2d');
      const x = col * this.rectWidth;
      const y = row * this.rectHeight;
      const key = `${row},${col}`;

      // 如果矩形已经被预约，不做任何改变
      if (this.reservedRoom.has(key) || this.closedRoom.has(key)) {
        return;
      }

      if (this.selectedRoom.has(key)) {
        this.selectedRoom.delete(key);
        ctx.clearRect(x, y, this.rectWidth, this.rectHeight);
        ctx.strokeRect(x, y, this.rectWidth, this.rectHeight);
      } else {
        this.selectedRoom.add(key);
        ctx.fillStyle = '#b3c8ff';  // 淡蓝色
        ctx.fillRect(x, y, this.rectWidth, this.rectHeight);
        ctx.strokeRect(x, y, this.rectWidth, this.rectHeight);
      }
    },
    // 预约
    handleReserve() {
      if (this.selectedRoom.size === 0) {
        return;
      }

      const groups = this.groupSelectedRooms();
      groups.forEach(group => this.reserveGroup(group));

      // 清空选中的房间
      this.selectedRoom.clear();

      // 隐藏tooltip
      this.showTooltip = false;

      // 重绘画布
      this.redrawCanvas();
    },
    // 对选中的房间进行分组
    groupSelectedRooms() {
      const rooms = Array.from(this.selectedRoom).map(key => {
        const [row, col] = key.split(',').map(Number);
        return { row, col };
      });

      const groups = [];
      const visited = new Set();

      rooms.forEach(room => {
        if (!visited.has(`${room.row},${room.col}`)) {
          const group = this.findlinelyConnectedRooms(room, rooms, visited);
          groups.push(group);
        }
      });

      return groups;
    },
    // 查找组内成员
    findlinelyConnectedRooms(startRoom, allRooms, visited) {
      const group = [];
      const queue = [startRoom];

      while (queue.length > 0) {
        const room = queue.shift();
        const key = `${room.row},${room.col}`;

        if (visited.has(key)) continue;

        visited.add(key);
        group.push(room);

        // 只检查横向相邻的房间
        const leftNeighbor = allRooms.find(r => r.row === room.row && r.col === room.col - 1);
        if (leftNeighbor && !visited.has(`${leftNeighbor.row},${leftNeighbor.col}`)) {
          queue.push(leftNeighbor);
        }

        const rightNeighbor = allRooms.find(r => r.row === room.row && r.col === room.col + 1);
        if (rightNeighbor && !visited.has(`${rightNeighbor.row},${rightNeighbor.col}`)) {
          queue.push(rightNeighbor);
        }
      }

      return group;
    },
    // 对分组进行预约
    reserveGroup(group) {
      // 计算组的边界
      const row = group[0].row; // 所有房间都在同一行
      const minCol = Math.min(...group.map(r => r.col));
      const maxCol = Math.max(...group.map(r => r.col));

      const x = minCol * this.rectWidth;
      const y = row * this.rectHeight;
      const width = (maxCol - minCol + 1) * this.rectWidth;
      const height = this.rectHeight;

      // 更新reservedRoomGroup和reservedRoom
      const newShape = { x, y, width, height, name: `${x},${y}`, rects: new Set() };
      group.forEach(room => {
        const key = `${room.row},${room.col}`;
        this.reservedRoom.add(key);
        newShape.rects.add(key);
      });

      this.reservedRoomGroup.push(newShape);
    },
    // 点击事件，处理具体形状的点击事件，如预约，关房等
    handleCanvasClick(e) {
      const rect = this.getRectFromCoords(e.offsetX, e.offsetY);
      const key = `${rect.row},${rect.col}`;
      
      if (this.reservedRoom.has(key)) {
        // 点击的是已预订的房间
        this.handleReservedRoomClick(rect);
      } else {
        // 处理普通点击逻辑
        this.handleRectClick(rect);
      }
    },
    // 预约后的房间的点击事件
    handleReservedRoomClick(rect) {
      // 触发一个自定义事件，传递被点击的预订房间信息
      this.$emit('reserved-room-click', {
        row: rect.row,
        col: rect.col,
        // 可以添加更多相关信息，如日期、房间号等
      });

      // 可以在这里添加其他逻辑，比如显示预订详情等
      console.log(`点击了预订的房间：行 ${rect.row}, 列 ${rect.col}`);
    },
    handleRectClick(rect) {},
    // 关房
    handleCloseRoom() {
      if (this.selectedRoom.size === 0) {
        return;
      }
      this.selectedRoom.forEach(key => {
        this.closedRoom.add(key);
      })
      this.selectedRoom.clear();
      this.showTooltip = false;
      this.redrawCanvas();
    },
    // 取消
    handleCancel() {
      this.selectedRoom.clear();
      this.redrawCanvas();
      this.showTooltip = false;
    },
  },
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
#canvas  {
  cursor: pointer;
}
.tooltip {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.temp-canvas {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
}
</style>
