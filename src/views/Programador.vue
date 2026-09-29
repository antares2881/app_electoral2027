<template>
    <div class="row">
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
        computed: {
            option() {
                return this.$route.query.opcion === 'calendario' ? 2 : 1;
            }
        },
    }
</script>
<style lang="scss">
</style>