<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <!-- <CardReporteVotante v-if="option === 1"></CardReporteVotante> -->
                <!-- <CardReporteLider v-if="option === 2"></CardReporteLider> -->
                <CardReporteCoordinador v-if="option === 3"></CardReporteCoordinador>
                <CardVotantesRepetidos v-if="option === 4"></CardVotantesRepetidos>
                <CardReportexUsuariosVue v-if="option == 5" ></CardReportexUsuariosVue>
            </div>
        </div>
    </div>
</template>
<script>
    // import CardReporteVotante from '../components/Reportes/CardReporteVotante'
    // import CardReporteLider from '../components/Reportes/CardReporteLider'
    import CardReporteCoordinador from '../components/Reportes/CardReporteCoordinador'
    import CardVotantesRepetidos from "../components/Reportes/CardVotantesRepetidos.vue";
    import CardReportexUsuariosVue from '@/components/Reportes/CardReportexUsuarios.vue';
    export default {
        components:{
            CardReporteCoordinador,
            CardVotantesRepetidos,
            CardReportexUsuariosVue
        },
        computed: {
            option() {
                const puedeVerEstadisticas = ![5, 6].includes(this.$store.state.user.role_id);
                const opcion = this.$route.query.opcion;
                if (opcion === 'repetidos') return 4;
                if (opcion === 'ingresados') return 3;
                return puedeVerEstadisticas ? 5 : 3;
            }
        },
    }
</script>
<style lang="scss">
</style>