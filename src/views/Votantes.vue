<template>
    <div class="row">
        <div class="col-md-12 my-3">
            <button class="btn btn-success mr-2"  @click="option=1"> <b-icon icon="person-check"></b-icon> Agregar militante</button>
            <button class="btn btn-dark mr-2"  @click="option=2" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2"> <b-icon icon="bar-chart"></b-icon> Ver militantes</button>
            <button class="btn btn-success mr-2"  @click="option=3" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2"> <b-icon icon="pencil-square"></b-icon> Gestionar militantes</button>
        </div>
        <div class="col-md-12">
            <CardAgregarVotante v-if="option === 1"></CardAgregarVotante>
            <CardVotantePuesto v-if="option === 2"></CardVotantePuesto>
            <CardGestionVotantes v-if="option === 3"></CardGestionVotantes>
        </div>
    </div>
</template>
<script>
    import CardAgregarVotante from '../components/Votantes/CardAgregarVotante'
    import CardVotantePuesto from '../components/Votantes/CardVotantePuesto'
    import CardGestionVotantes from '../components/Votantes/CardGestionVotantes'
    export default {
        components:{
            CardAgregarVotante,
            CardVotantePuesto,
            CardGestionVotantes
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