<template>
  <div>
    <LineChart v-if="data?.length > 0" v-bind="lineChartProps" />
  </div>
</template>

<script>
import { buildChartData } from "../services/covidUtils";
import { Chart, registerables } from 'chart.js';
import { LineChart, useLineChart } from 'vue-chart-3';
import numeral from "numeral";
import { ref, computed, watch } from 'vue';

Chart.register(...registerables);

export default {
  name: 'LineGraph',
  props: {
    casesType: String
  },
  components: {
    LineChart
  },
  setup (props) {
    const data = ref({});

    const options = computed(() => ({
      legend: {
        display: false,
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (tooltipItem, _data) {
            console.log(_data);
            return numeral(tooltipItem.value).format("+0,0");
          },
        },
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              format: "MM/DD/YY",
              tooltipFormat: "ll",
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, _index, _values) {
                console.log(_index, _values);
                return numeral(value).format("0a");
              },
            },
          },
        ],
      },
    }));

    const chartData = computed(() => ({
      datasets: [
        {
          label: `${props.casesType} evolution in last 120 days`,
          backgroundColor: "rgba(204, 16, 52, 0.5)",
          borderColor: "#CC1034",
          fill: true,
          data: data.value,
        },
      ],
    }));


    const fetchData = async () => {
      const res = await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120");
      return await res.json();
    };

    watch(() => props.casesType, async (selection, prevSelection) => { 
      console.log(prevSelection, selection);
      const serverData = await fetchData();
      data.value = buildChartData(serverData, selection);
    });

    const { lineChartProps, lineChartRef } = useLineChart({
      chartData: chartData,
      options,
    });

    const initialSetup = async () => {
      const serverData = await fetchData();
      data.value = buildChartData(serverData, props.casesType);
    };

    initialSetup();

    return {
      data,
      lineChartProps,
      lineChartRef
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
