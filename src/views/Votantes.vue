<template>
    <div class="row">
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
        computed: {
            option() {
                const opcion = this.$route.query.opcion;
                const puedeGestionar = [1, 2].includes(this.$store.state.user.role_id);
                if (puedeGestionar && opcion === 'ver') return 2;
                if (puedeGestionar && opcion === 'gestionar') return 3;
                return 1;
            }
        }
    }
</script>
