<template>
  <el-card @click="onClick()" class="infoBox" :class="[activeClass, isRedClass]" >
    <div>
      <h3 class="infos__title">{{title}}</h3>
      <h2 class="infoBox__cases" :class="[!isRed ? 'infoBox__cases--green' : '']">
          {{ cases }}
      </h2>
      <h4 class="infoBox__total">{{ prettyPrintedStat(total) }} Total</h4>
    </div>
  </el-card>
</template>

<script>
import { prettyPrintStat } from "../services/covidUtils";
import { computed } from 'vue'

export default {
  name: 'InfoBox',
  props: {
    title: String,
    cases: String,
    total: String,
    active: Boolean,
    isRed: Boolean
  },
  setup (props, { emit }) {
    const activeClass = computed(() => props.active ? 'infoBox--selected' : '' );
    const isRedClass = computed(() => props.isRed ? 'infoBox--red' : '' );

    const prettyPrintedStat = (stat) => prettyPrintStat(stat);

    return {
      activeClass,
      isRedClass,
      prettyPrintedStat,
      onClick () {
        emit('set-cases-type');
      }
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.infoBox {
  flex: 1;
}

.infoBox:not(:last-child) {
  margin-right: 10px;
}

.infoBox--selected {
  border-top: 10px solid greenyellow;
}

.infoBox--red {
  border-color: red;
}

.infoBox__cases--green {
  color: lightgreen !important;
}

.infoBox__cases {
  color: #cc1034;
  font-weight: 600;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.infoBox__total {
  color: #6c757d;
  font-weight: 700 !important;
  font-size: 0.8rem !important;
  margin-top: 15px !important;
}

.infos__title {
  margin-bottom: 1rem;
  color: #909399;
}
</style>
