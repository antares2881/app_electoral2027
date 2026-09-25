<template>
    <div class="row">
        <div class="col-md-12 my-3">
            <button class="btn btn-success mr-2" @click="option=1"><b-icon icon="calendar"></b-icon> Agendas</button>
            <button class="btn btn-dark mr-2" @click="option=2"> <b-icon icon="calendar2-date"></b-icon> Calendario electoral</button>
        </div>
        <div class="col-md-12">
            <CardAgenda v-if="option === 1"></CardAgenda>
            <CardCalendario v-if="option === 2"></CardCalendario>
        </div>
    </div>
</template>
<script>
    import CardAgenda from '../components/Programador/CardAgenda'
    import CardCalendario from '../components/Programador/CardCalendario'
    export default {
        components:{
            CardAgenda,
            CardCalendario
        },
        data() {
            return {
                option: 0
            }
        },
    }
</script>
<style lang="scss">
</style>