<template>
  <div>
    <canvas ref="canvas" width="800" height="400"></canvas>
  </div>
</template>

<script>
export default {
  name: 'picCanvas',
  data: function() {
    return {
      list: [
        {
          "id": "ZCaJKJIBltMScvPqWuLO",
          "equipmentCode": "8SEL004PO",
          "faultNameBoList": [
            {
              "faultName": "8SEL001PS到高液位时， 8SEL004PO无法自动运行",
              "wxyyfxList": [
                "接触器下端口C相接线松动，热继动作，导致8SEL004PO无法自动运行"
              ],
              "fxfxList": [
                "地坑水无法排出，有放射性水满溢的风险"
              ]
            }
          ],
          "updateTime": "2024-09-25 17:35:42"
        },
        {
          "id": "ZSaJKJIBltMScvPqWuLO",
          "equipmentCode": "4GSS001VV",
          "faultNameBoList": [
            {
              "faultName": "4GSS001VV 阀位反馈器磁条脱落导致4GSS001VV 全开全关动作",
              "wxyyfxList": [
                "4GSS001VV 参与阀位反馈的磁条脱落，导致4GSS001VV 参与控制的开度反馈固定在27%，导致4GSS001VV 在闭环控制作用下出现全开全关，蒸汽流量波动产生瞬态。阀位阀门脱落直接原因定位器与磁条固定螺丝垫片干涉导致磁条螺丝松动。"
              ],
              "fxfxList": [
                "1、4GSS001/002VV持续波动导致一回路温度和压力持续波动，影响一回路压力、水位和温度的正常控制；2、4GSS001/002VV持续波动导致汽水母管压差不动及蒸汽发生器水位波动若持续波动且发散，存在蒸汽发生器水位高（P14）和蒸汽发生器水位低低停堆风险；3、进入汽机蒸汽参数变化，导致汽轮发电机组轴系受力异常变化，动静摩擦导致运行参数异常停机。"
              ]
            },
            {
              "faultName": "4号机组升功率期间4GSS001VV出现全开全关波动",
              "wxyyfxList": [],
              "fxfxList": [
                "1、4GSS001/002VV持续波动导致一回路温度和压力持续波动，影响一回路压力、水位和温度的正常控制；2、4GSS001/002VV持续波动导致汽水母管压差不动及蒸汽发生器水位波动若持续波动且发散，存在蒸汽发生器水位高（P14）和蒸汽发生器水位低低停堆风险；3、进入汽机蒸汽参数变化，导致汽轮发电机组轴系受力异常变化，动静摩擦导致运行参数异常停机。"
              ]
            }
          ],
          "updateTime": "2024-09-25 17:35:42"
        },
        {
          "id": "aCaJKJIBltMScvPqWuLO",
          "equipmentCode": "4DVC002LP",
          "faultNameBoList": [
            {
              "faultName": "4 号机组启动4DVC001/003ZV 后，4DVC002LP 压差超过监督要求限值460Pa.g",
              "wxyyfxList": [
                "维修人员对4DVC151VAR 进行检查，并同步更换高效过滤器，未发现异常，对4DVC002LP进行校验，同样未发现明显异常。经各专业讨论分析，重新执行一次风量调整并使用外接压差表进行测量，确认压差超限的根本原因为：风量高于定期试验要求的额定工况，导致压差超限。促成原因：1）配合人员未在正确的位置测量风量导致风量测量不准确；2）调节风量时4DVC151VAR 未调节至有效调节开度区间。"
              ],
              "fxfxList": [
                "4DVC002LP 超限，违反监督要求。"
              ]
            }
          ],
          "updateTime": "2024-09-25 17:35:42"
        },
        {
          "id": "aSaJKJIBltMScvPqWuLO",
          "equipmentCode": "3REA072MN",
          "faultNameBoList": [
            {
              "faultName": "3REA072MN 较3REA052MN 和就地液位计低0.42m",
              "wxyyfxList": [
                "3REA072MN 仪表负压侧少量积水。"
              ],
              "fxfxList": [
                "导致PAMS 仪表3REA072MN 测量失真，无法准确监测3REA004BA 液位，3REA072MN 不可用时产生第二组IO2：PAMS1。"
              ]
            }
          ],
          "updateTime": "2024-09-25 17:35:42"
        },
        {
          "id": "aiaJKJIBltMScvPqWuLO",
          "equipmentCode": "4RCP240MY",
          "faultNameBoList": [
            {
              "faultName": "4RCP240MY 转速卡件故障",
              "wxyyfxList": [
                "仪控间机柜4RCP240MC、4RCP241MC 均没有异常，为4RCP240MY 核级转速机架处理单元损坏。"
              ],
              "fxfxList": [
                "1、4RPR162KS：2 环主泵转速低低，若再出现其他环路主泵转速表故障和P7 信号，会触发停堆保护和启动ASG 汽动泵；2、4RPR159KS：2 环主泵转速低，若再出现其他环路主泵转速表故障和P7 信号，会触发机组甩厂用电；以上两个KS，由于触发保护需要其他另外2 个信号参与，故障处理相对不紧急；3、4RPR169KS：此信号表明2 环超温DATA T 已触发，若另外一个环路超温DATA T 也触发，会直接导致反应堆停堆；4、4RPR165KS：此信号表明2 环超功率△T 已触发，若另外一个环路超功率△T 也触发，会直接导致反应堆停堆；以上KS，由于触发保护仅需要其他另外1 个环路信号参与，故障处理非常紧急。"
              ]
            },
            {
              "faultName": "4RCP240/340MY 转速表同时异常波动",
              "wxyyfxList": [
                "转速仪表机架故障。"
              ],
              "fxfxList": [
                "1、4RPR162/163KS：2/3 环主泵转速低低，3 取2 与P7 信号，直接触发停堆保护和启动ASG 汽动泵；（以上两个KS，由于当时机组处于NS/RRA 模式，P7 信号不存在，因此相应的风险不存在）；2、4RPR159/160KS：2/3 环主泵转速低，3 取2 与P7 信号，直接触发机组甩厂用电；（以上两个KS，由于当时机组处于NS/RRA 模式，P7 信号不存在，因此相应的风险不存在）；3、两块主泵转速表4RCP240/340MY 同时异常波动，若处理不及时，转速表触发质量位，会导致超温/超功率△T 停堆；4、2.5MPa.g 平台，顶轴油泵长期运行，将会导致主泵副推力瓦受压更大，使副推力瓦温度升高，会导致主泵损坏；5、非预期的主泵停运，会导致一回路压力和温度波动，存在一回路压力和温度超出梯形图风险，将违反技术规范，产生运行事件，特别是停运2 号主泵，会导致RRA 流量异常增大，其他电厂有过类似经验反馈；6、4RCP240MC 和4RCP241MC 转速表同时故障，根据技术规范，将会产生I02：RPR1，要求1 个月内完成修复；7、4RCP240MY 和4RCP340MY 转速表同时故障，根据技术规范，将会产生I01：RPR6，要求必须在1 天内恢复至不超过一个测量通道不可用。"
              ]
            }
          ],
          "updateTime": "2024-09-25 17:35:42"
        },
        {
          "id": "bSaJKJIBltMScvPqWuLO",
          "equipmentCode": "3DVH000XXX",
          "faultNameBoList": [
            {
              "faultName": "执行FQ3-SFZ-T-008 3DVH011VAF 和3DVH015VAF 未按照预期关闭",
              "wxyyfxList": [
                "3DVH011VAF 和3DVH015VAF 电磁阀检查动作正常，阀门挂钩安装角度有误导致阀门无法关闭。"
              ],
              "fxfxList": [
                "火灾情况下阀门无法按要求关闭，有可能导致事故扩大；导致QSR 定期试验不合格。"
              ]
            }
          ],
          "updateTime": "2024-09-25 17:35:42"
        },
        {
          "id": "cCaJKJIBltMScvPqWuLO",
          "equipmentCode": "4KRT033MA",
          "faultNameBoList": [
            {
              "faultName": "4KRT013KA8（KRT033MA 监测通道故障报警）",
              "wxyyfxList": [
                "4KRT033MA 参考峰漂移导致报警触发"
              ],
              "fxfxList": [
                "1、报警出现前，机组已存在3 个第二组IO（JDT2，EAS2，JP*1），4KRT033MA 不可用产生IO2：KRT5，因4KRT033MA 和KRT043MA 均位于4KRT033BC 中，仪控和辐射防护确认4KRT043MA 同时也不可用，4KRT043MA 不可用产生一个IO2：PAMS2。故11:04 分开始4 号机组累积5 个第二组I0，根据运行技术规范，要求开始24H 后撤计时。当班值在4KRT033MA 报警触发后，立即要求现场停止正在执行FQ8-JPT-T-002试验并进行雨淋阀的恢复操作，11:18 分辅变雨淋阀恢复可用，消除JP*第二组I0，累积I0 数量减为4 个。退出技术规范后撤计时。2、4KRT033MA（和4KRT043MA）不可用，影响3 号蒸汽发生器中N-16 和惰性气体γ活度以及SG 一次侧向二次侧的泄漏检测。"
              ]
            }
          ],
          "updateTime": "2024-09-25 17:35:42"
        },
        {
          "id": "cSaJKJIBltMScvPqWuLO",
          "equipmentCode": "2ETY000XXX",
          "faultNameBoList": [
            {
              "faultName": "2ETY035KA（碘吸附器电加热器温度高）无法消除",
              "wxyyfxList": [
                "检查2ETY001ST 高报触发，发现开关上的微动开关无法复位，而导致2ETY035KA 高报一直触发"
              ],
              "fxfxList": [
                "导致2ETY035KA（碘吸附器电加热器温度高）报警一直触发"
              ]
            }
          ],
          "updateTime": "2024-09-25 17:35:42"
        },
        {
          "id": "ciaJKJIBltMScvPqWuLO",
          "equipmentCode": "1RCP011PO",
          "faultNameBoList": [
            {
              "faultName": "1RCP011PO 显示故障洋红色",
              "wxyyfxList": [
                "1RCP997AR 内双电源切换开关故障导致主、备用电源异常切换"
              ],
              "fxfxList": [
                "顶轴油泵1RCP011PO 电源冗余度降低"
              ]
            }
          ],
          "updateTime": "2024-09-25 17:35:42"
        },
        {
          "id": "cyaJKJIBltMScvPqWuLO",
          "equipmentCode": "3GSY002AR",
          "faultNameBoList": [
            {
              "faultName": "发电机出线箱强迫风冷监测柜3GSY002AR失电",
              "wxyyfxList": [
                "3GSY201MO 电机故障（电动机相间绕组绝缘电阻及单相绕组对地绝缘电阻为0MΩ），B 单元跳闸后，B 单元入口风阀关闭，但关限位无法触发，导致A 单元风机闭锁启动。"
              ],
              "fxfxList": [
                "1、若强迫风冷装置无法启动，会导致3GSY101MT、201MT、301MT温度上升，根据报警卡，任何温度达到105℃，发电机输出电流需要降至20kA（母线最大允许的自冷电流）。当前机组功率1089MW，发电机平均电流25kA，存在极大非计划降功率风险；2、发电机出线端子和保护箱温度升高，可能会导致发电机出线侧CT损坏，存在跳机风险。"
              ]
            }
          ],
          "updateTime": "2024-09-25 17:35:42"
        }
      ],
      single: {
        "id": "ZCaJKJIBltMScvPqWuLO",
        "equipmentCode": "8SEL004PO",
        "faultNameBoList": [
          {
            "faultName": "8SEL001PS到高液位时， 8SEL004PO无法自动运行",
            "wxyyfxList": [
              "接触器下端口C相接线松动，热继动作，导致8SEL004PO无法自动运行",
              "接触器下端口C相接线松动，热继动作，导致8SEL004PO无法自动运行",
              "接触器下端口C相接线松动，热继动作，导致8SEL004PO无法自动运行"
            ],
            "fxfxList": [
              "地坑水无法排出，有放射性水满溢的风险"
            ]
          },
          {
            "faultName": "8SEL001PS到高液位时， 8SEL004PO无法自动运行",
            "wxyyfxList": [
              "接触器下端口C相接线松动，热继动作，导致8SEL004PO无法自动运行"
            ],
            "fxfxList": [
              "地坑水无法排出，有放射性水满溢的风险"
            ]
          }
        ],
        "updateTime": "2024-09-25 17:35:42"
      },

      rectHeight: 60,
      rectMarginBottom: 30,
      rectWidth: 0,
      canvasPadding: 60,

      rects: []
    };
  },
  mounted() {
    this.draw()
  },
  methods: {
    draw() {
      this.initCanvas()
    },
    initCanvas() {
      const leftCount = this.single.faultNameBoList.reduce((acc, current) => acc + current.wxyyfxList.length, 0)
      const rightCount = this.single.faultNameBoList.reduce((acc, current) => acc + current.fxfxList.length, 0)
      const maxRow = Math.max(leftCount, rightCount)
      const canvasHeight = maxRow * this.rectHeight + (maxRow + 1) * this.rectMarginBottom
      const canvasWidth = this.$refs.canvas.parentElement.offsetWidth

      this.$refs.canvas.height = canvasHeight
      this.$refs.canvas.width = canvasWidth

      this.rectWidth = (canvasWidth - this.canvasPadding * 2) / 5

      this.generateRects()
      this.drawRects()
    },
    generateRects() {
      let currentHeight = 0

      this.single.faultNameBoList.forEach((fault) => {
        fault.wxyyfxList.forEach((item, index) => {
          this.rects.push({
            x: this.canvasPadding,
            y: this.canvasPadding + currentHeight + index * this.rectHeight + index * this.rectMarginBottom,
            width: this.rectWidth,
            height: this.rectHeight,
            text: item
          })
        })
        currentHeight += fault.wxyyfxList.length * this.rectHeight + (fault.wxyyfxList.length) * this.rectMarginBottom
      })
    },
    drawRects() {
      this.rects.forEach((rect) => {
        const ctx = this.$refs.canvas.getContext('2d')
        ctx.fillStyle = '#17b317'
        this.drawRoundedRect(ctx, rect.x, rect.y, rect.width, rect.height, 5)

        ctx.fillStyle = '#fff'
        ctx.font = '14px Arial'
        this.drawText(rect.text, rect.x + 10, rect.y + 20, this.rectWidth - 40)
      })
    },
    drawRoundedRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y); // 左上角
      ctx.lineTo(x + width - radius, y); // 上边
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius); // 右上角
      ctx.lineTo(x + width, y + height - radius); // 右边
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); // 右下角
      ctx.lineTo(x + radius, y + height); // 下边
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius); // 左下角
      ctx.lineTo(x, y + radius); // 左边
      ctx.quadraticCurveTo(x, y, x + radius, y); // 左上角
      ctx.closePath();
      ctx.fill(); // 填充颜色
    },
    drawText(text, x, y, maxWidth) {
      const ctx = this.$refs.canvas.getContext('2d')
      const words = text.split('');
      let line = '';

      for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + '';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
              ctx.fillText(line, x, y, maxWidth);
              line = words[n] + '';
              y = y + 5 + parseInt(ctx.font, 10); // 调整行间距
          } else {
              line = testLine;
          }
      }
      ctx.fillText(line, x, y);
    }
  }
}
</script>