<template>
    <div class="row">
        <div class="col-12">
            <button class="btn btn-primary mr-2" @click="option=1"> <b-icon icon="check2-square"></b-icon> Verificar firma</button>
            <button class="btn btn-dark" @click="option=2" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 || $store.state.user.role_id === 3" > <b-icon icon="pie-chart"></b-icon> Reportes</button>
        </div>
        <div class="col-12 mt-3">
            <CardAgregarFirma v-if="option === 1"></CardAgregarFirma>
            <CardReporteFirmas v-if="option === 2"></CardReporteFirmas>
        </div>        
    </div>
</template>
<script>
    import CardAgregarFirma from '../components/Firmas/CardAgregarFirma'
    import CardReporteFirmas from '../components/Firmas/CardReporteFirmas'
    export default {
        components:{
            CardAgregarFirma,
            CardReporteFirmas
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