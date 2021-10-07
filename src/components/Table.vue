<template>
  <div class="table">
    <tr v-for="country in countries" :key="country.country" >
      <td>{{ country.country }}</td>
      <td>
        <strong>{{ numeralFormat(country.cases, "0,0") }}</strong>
      </td>
    </tr>
  </div>
</template>

<script>

export default {
  name: 'Table',
  props: {
    countries: Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.table {
  margin-top: 20px;
  overflow: scroll;
  color: #6a5d5d;
  background-color: white;
  height: 400px;
}

.table tr {
  display: flex;
  justify-content: space-between;
}

.table td {
  padding: 0.5rem;
  border: none;
}

.table tr:nth-of-type(odd) {
  background-color: #f3f2f8;
}
</style>
