<template>
    <div class="row">
        <div class="col-12 mt-3">
            <CardAdminUser v-if="option === 1"></CardAdminUser>
            <CardAdminLideres v-if="option === 2"></CardAdminLideres>
            <CardAdminRecolectores v-if="option === 3"></CardAdminRecolectores>
            <CardAdminCoordinadores v-if="option === 4"></CardAdminCoordinadores>
            <CardAdminCandidatos v-if="option === 5"></CardAdminCandidatos>
            <CardAdminSubCoordinadores v-if="option === 6"></CardAdminSubCoordinadores>
        </div>
    </div>
</template>
<script>

    import CardAdminUser from '../components/Config/CardAdminUser'
    import CardAdminLideres from '../components/Config/CardAdminLideres'
    import CardAdminRecolectores from '../components/Config/CardAdminRecolectores'
    import CardAdminCoordinadores from '../components/Config/CardAdminCoordinadores'
    import CardAdminCandidatos from '../components/Config/CardAdminCandidatos'
    import CardAdminSubCoordinadores from '../components/Config/CardAdminSubCoordinadores'

    export default {
        components:{
            CardAdminUser,
            CardAdminLideres,
            CardAdminRecolectores,
            CardAdminCoordinadores,
            CardAdminCandidatos,
            CardAdminSubCoordinadores
        },
        computed: {
            opcionesPersonal() {
                const usuario = this.$store.state.user;
                const candidato = (usuario.candidato || [])[0] || {};
                const admin = [1, 2].includes(usuario.role_id);
                const permiteUsuarios = Number(candidato.corporacione_id) !== 5;
                return [
                    { clave: 'candidatos', texto: 'Candidatos', valor: 5, visible: admin && permiteUsuarios },
                    { clave: 'coordinadores', texto: 'Coordinadores', valor: 4, visible: admin },
                    { clave: 'lideres', texto: 'Líderes', valor: 2, visible: admin },
                    { clave: 'usuarios', texto: 'Usuarios', valor: 1, visible: [1, 2, 6].includes(usuario.role_id) && permiteUsuarios }
                ].filter(opcion => opcion.visible);
            },
            option() {
                const seleccionada = this.opcionesPersonal.find(opcion => opcion.clave === this.$route.query.opcion);
                const opcion = seleccionada || this.opcionesPersonal[0];
                return opcion ? opcion.valor : 0;
            }
        },
    }
</script>
<style lang="scss">
</style>