<template>
  <CChartBar
    :datasets="dataset.datasets"
    :labels="dataset.labels"
    :options="defaultOptions"
  />
</template>

<script>
import { CChartBar } from "@coreui/vue-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils/src";

export default {
  name: "MainChart",
  components: {
    CChartBar,
  },
  props: {
    data: Array,
    mode: String,
  },
  methods: {
    getLabels() {
      return this.data.map(function(d) {
        return d.label.day;
      });
    },
    getData() {
      return this.data.map(function(d) {
        console.log(d.value);
        return d.value;
      });
    },
  },
  computed: {
    dataset() {
      return {
        datasets: [
          {
            data: this.getData(),
            label: "Responses",
          },
        ],
        labels: this.getLabels(),
      };
    },
    defaultOptions() {
      return {
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                //maxTicksLimit: 5,
                stepSize: 1,
                //max: 250
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
        elements: {
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
          },
        },
      };
    },
  },
};
</script>
