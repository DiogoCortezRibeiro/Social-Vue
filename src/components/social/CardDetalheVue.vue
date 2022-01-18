<template>

<span>
  <div v-if="img && img != '#'" class="card-image">
    <a v-if="link && link != '#'" :href="link" target="_blank">
      <img :src="img">
      <span class="card-title">{{titulo || ''}}</span>
    </a>
    <span v-else>
      <img :src="img">
      <span class="card-title">{{titulo || ''}}</span>
    </span>
  </div>

  <div class="card-content">
    <span v-if="!img || img == '#'">
      <span class="card-title">{{titulo || ''}}</span>
    </span>
    <p>{{txt}}</p>
    <p  v-if="link && link != '#'">
      <a :href="link" target="_blank">{{ link }}</a>
    </p>
  </div>
</span>


</template>

<script>


export default {
  name: 'CardDetalheVue',
  props:['img','titulo','txt','link'],
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
  max-width: 100ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
