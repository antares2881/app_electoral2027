<template>
    <div>
        <!-- <button class="btn btn-primary mr-2" @click="option=1"><b-icon icon="bar-chart"></b-icon> General de votantes</button> -->
        <!-- <button class="btn btn-primary mr-2" @click="option=2"><b-icon icon="pie-chart"></b-icon>x lideres</button> -->
        <button class="btn btn-danger mr-2 col-md-3 col-12 my-2" @click="option=4" ><b-icon icon="people-fill"></b-icon> Militantes repetidos</button>
        <button class="btn btn-dark mr-2 col-md-3 col-12 my-2" @click="option=3"><b-icon icon="person-lines-fill"></b-icon> Militantes ingresados</button>
        <button class="btn btn-success mr-2 col-md-3 col-12 my-2" @click="option=5" v-if="$store.state.user.role_id !== 5 && $store.state.user.role_id !== 6 "><b-icon icon="bar-chart"></b-icon> Estadisticas x Usuarios</button>
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
        data() {
            return {
                option: 0
            }
        },
        methods: {
            
        },
    }
</script>
<style lang="scss">
</style>