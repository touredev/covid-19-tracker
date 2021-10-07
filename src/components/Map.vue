<template>
  <div class="map">
    <l-map :center="center" :zoom="zoom">
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
      <l-circle
        v-for="(country, i) in countries"
        :key="i"
        :lat-lng="[country.countryInfo.lat, country.countryInfo.long]"
        :color="circleColor"
        fill="true"
        :fill-color="fillColor"
        fill-opacity=0.4
        :radius="circleRadius(country)"
      >
        <l-popup>
          <div class="info-container">
            <div
              class="info-flag"
              :style="{'background-image': `url(${country.countryInfo.flag})`}"
            ></div>
            <div class="info-name">{{ country.country}}</div>
            <div class="info-confirmed">
              Cases: {{ numeralFormat(country.cases, "0,0") }}
            </div>
            <div className="info-recovered">
              Recovered: {{ numeralFormat(country.recovered, "0,0") }}
            </div>
            <div className="info-deaths">
              Deaths: {{ numeralFormat(country.deaths, "0,0") }}
            </div>
          </div>
        </l-popup>
        </l-circle>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LCircle, LPopup } from "@vue-leaflet/vue-leaflet";
import { computed } from 'vue'

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LCircle,
    LPopup
  },
  props: {
    countries: Array,
    casesType: {type: String, default: "cases"},
    center: Array,
    zoom: Number
  },
  setup (props) {
    const casesTypeColors = {
      cases: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 500,
      },
      recovered: {
        hex: "#7dd71d",
        rgb: "rgb(125, 215, 29)",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 750,
      },
      deaths: {
        hex: "#fb4443",
        rgb: "rgb(251, 68, 67)",
        half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 1250,
      },
    };
    
    const circleRadius = (country) => Math.sqrt(country[props.casesType]) * casesTypeColors[props.casesType].multiplier;
    const circleColor = computed(() => casesTypeColors[props.casesType].hex);
    const fillColor = computed(() => casesTypeColors[props.casesType].hex);

    return {
      circleRadius,
      circleColor,
      fillColor
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.map {
  height: 500px;
  background-color: white;
  padding: 1rem;
  border-radius: 20px;
  margin-top: 16px;
  box-shadow: 0 0 8px -4px rgba(0, 0, 0, 0.5);
}

.map .leaflet-container {
  height: 100%;
  border-radius: 12px;
}

.info-flag img {
  width: 100px;
  border-radius: 5px;
}

.info-name {
  font-size: 20px;
  font-weight: bold;
  color: #555;
}

.info-container {
  width: 150px;
}

.info-flag {
  height: 80px;
  width: 100%;
  background-size: cover;
  border-radius: 8px;
}

.info-confirmed,
.info-recovered,
.info-deaths {
  font-size: 16px;
  margin-top: 5px;
}
</style>
