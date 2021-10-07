<template>
  <div class="app">
    <div class="app__left">
      <div class="app__header">
        <h1>COVID-19 Tracker</h1>
        <el-select v-model="currentCountry" filterable placeholder="Select country" @change="onCountryChange" class="app__dropdown">
          <el-option :key="worldwide" :label="Worldwide" :value="worldwide">
          </el-option>
          <el-option
            v-for="country in countries"
            :key="country.value"
            :label="country.name"
            :value="country.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="app__stats">
        <InfoBox title="Coronavirus Cases" is-red :active="casesType === 'cases'" :cases="countryInfos.todayCases" :total="numeralFormat(countryInfos.cases, '0.0a')" @set-cases-type="setCasesType('cases')" />
        <InfoBox title="Recovered" :active="casesType === 'recovered'" :cases="countryInfos.todayRecovered" :total="numeralFormat(countryInfos.recovered, '0.0a')" @set-cases-type="setCasesType('recovered')"/>
        <InfoBox title="Deaths" is-red :active="casesType === 'deaths'" :cases="countryInfos.todayDeaths" :total="numeralFormat(countryInfos.deaths, '0.0a')" @set-cases-type="setCasesType('deaths')" />
      </div>
      <Map :countries="mapCountries" :casesType="casesType" :center="mapCenter" :zoom="mapZoom" />
    </div>
    <el-card class="app__right">
      <div class="app__information">
        <h3>Live Cases by Country</h3>
        <Table :countries="tableData"/>
        <h3>Worldwide new {{ casesType }}</h3>
        <LineGraph :casesType="casesType" />
      </div>
    </el-card>
  </div>
</template>

<script>
import InfoBox from '@/components/InfoBox';
import Map from '@/components/Map';
import Table from '@/components/Table';
import LineGraph from '@/components/LineGraph';

import { sortData } from "./services/covidUtils";

import { ref } from 'vue'

export default {
  name: 'App',
  components: {
    InfoBox,
    Map,
    Table,
    LineGraph
  },
  setup() {
    const countries = ref([]);
    const currentCountry = ref('worldwide');
    const countryInfos = ref({});
    const casesType = ref("cases");
    const mapCountries = ref([]);
    const tableData = ref([]);
    const mapCenter = ref([34.80746, -40.4796]);
    const mapZoom = ref(2);

    const fetchCovidData = async () => {
      const res = await fetch("https://disease.sh/v3/covid-19/all");
      return await res.json();
    };

    const fetchCountriesData = async () => {
      const res = await fetch("https://disease.sh/v3/covid-19/countries");
      return await res.json();
    };

    const setCasesType = (type) => casesType.value = type;

    const onCountryChange = async (selected) => {
      const url = selected === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${selected}`;
      await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        countryInfos.value = data;
        mapCenter.value = [data.countryInfo.lat, data.countryInfo.long];
        mapZoom.value = 3;
      });
    };


    const initialSetup = async () => {
      countryInfos.value = await fetchCovidData();
      const data = await fetchCountriesData();
      mapCountries.value = data;
      countries.value = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));
      tableData.value = sortData(data);
    };

    initialSetup();

    return {
      countries,
      currentCountry,
      countryInfos,
      casesType,
      mapCenter,
      mapZoom,
      mapCountries,
      tableData,
      setCasesType,
      onCountryChange
    };
  }
}
</script>

<style lang="scss">  
#app {
  font-family: 'Roboto Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

* {
  margin: 0;
}

body {
  background-color: #f5f6fa;
}

.app {
  display: flex;
  justify-content: space-evenly;
  background-color: #f5f6fa;
  padding: 20px;
}

.app__dropdown {
  background-color: white;
}

.app__header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;
}

.app__header > h1 {
  color: #fc3c3c;
  font-size: 2rem;
}

.app__stats {
  display: flex;
  justify-content: space-between;
}

.app__left {
  flex: 0.9;
}

.app__information > h3 {
  color: #6a5d5d;
  font-weight: 400;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.app__information > h3:last-of-type {
  margin-top: 1rem;
}

@media (max-width: 990px) {
  .app {
    flex-direction: column;
  }
}
</style>
