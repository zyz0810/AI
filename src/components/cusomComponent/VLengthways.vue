<template>
  <div>
    <div v-if="propValue.length != 0" class="lengthwaysProductBox">
      <div
        v-for="(item, index) in propValue"
        :key="index"
        class="product"
        draggable="true"
        @drop="handleDrop($event, item, index)"
        @dragover="handleDragOver"
      >
        <div class="topBox">
          <el-image :src="item.skuImageUrl"></el-image>
        </div>
        <ul class="bottomBox">
          <li class="name">{{ item.name }}</li>
          <li class="specificationValue">
            中包装：1{{ item.specificationValue }}
          </li>
          <li class="manufacture">{{ item.manufacture.name }}</li>
          <li class="retailPrice attachMoney" style="line-height: 20px">
            {{ item.retailPrice }}
            <div class="lengthwaysPlus">
              <!-- <i class="el-icon-remove"></i>
              <input class="lengthwaysInput" /> -->
              <i class="el-icon-circle-plus"></i>
            </div>
          </li>
          <li class="marketPrice attachMoney">{{ item.marketPrice }}</li>
          <!-- <li>
            <span class="fullGift"></span>
          </li> -->
          <li class="createSupplierName">
            {{ item.supplier.name }}
          </li>
        </ul>
      </div>
    </div>
    <img src="@/assets/app/column.png" alt="" v-else class="carouselImg" />
  </div>
</template>

<script>
export default {
  props: {
    propValue: {
      type: [Object, Array],
      require: true,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    handleDragStart(e, value, index) {
      e.dataTransfer.setData("index", index);
      e.dataTransfer.setData("type", "list");
    },
    handleDrop(e, value, currentIndex) {
      const type = e.dataTransfer.getData("type");
      if (type != "list") {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
      const index = e.dataTransfer.getData("index");
      const data = this.propValue[index];
      this.propValue.splice(index, 1, value);
      this.propValue.splice(currentIndex, 1, data);
    },
    handleDragOver(e) {
      e.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
.lengthwaysProductBox {
  display: flex;
  padding: 10px;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
  .product {
    width: calc(50% - 10px);
    min-height: 300px;
    box-shadow: 0px 5px 21px 0px rgba(63, 63, 63, 0.12);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    .topBox {
      height: 220px;
    }
    .bottomBox {
      padding: 0 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      li {
        line-height: 14px;
        padding: 2px 0;
      }
      .name,
      .retailPrice {
        font-size: 14px;
        font-weight: bold;
        line-height: 14px;
      }
      .retailPrice {
        color: #e1082d;
      }
      .marketPrice {
        font-size: 12px;
        text-decoration: line-through;
        color: #999999;
      }
      .createSupplierName,
      .manufacture,
      .specificationValue {
        color: #999999;
        font-size: 80%;
        font-size: 12px;
      }
      .manufacture::before {
        content: "厂";
        vertical-align: top;
        font-size: 12px;
        border: 1px solid;
        border-radius: 8px;
        padding: 0 4px;
      }
    }
  }
}

.attachMoney::before {
  content: "￥";
  vertical-align: baseline;
  font-size: 10px;
}
.manufacture::before {
  content: "厂";
  vertical-align: top;
  font-size: 12px;
  border: 1px solid;
  border-radius: 8px;
  padding: 0 4px;
}

.fullGift::before {
  content: "满赠";
  vertical-align: baseline;
  font-size: 10px;
  border: 1px solid red;
  border-radius: 12px;
  color: #e1082d;
  padding: 0 2px;
}
.lengthwaysPlus {
  float: right;
  font-size: 18px;
  color: #e1082d;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lengthwaysInput {
  width: 36px;
  height: 20px;
  font-size: 12px;
  margin: 0 2px;
}
.lengthwaysInput:focus {
  border: 1px solid #e1082d;
  outline: none;
  border-radius: 2px;
}
</style>