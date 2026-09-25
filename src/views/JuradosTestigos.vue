<template>
    <div class="row" >
        <div class="col-md-12 my-3" v-if="option === 0">
            <button class="btn btn-success mr-2" @click="option=1"><b-icon icon="person-fill"></b-icon> Jurados</button>
            <button class="btn btn-dark" @click="option=2"><b-icon icon="person-fill"></b-icon> Testigos</button>
        </div>
        <div class="col-md-12">
            <CardJurados v-if="option === 1" @regresar="option = $event"></CardJurados>
            <CardTestigos v-if="option === 2" @regresar="option = $event"></CardTestigos>
        </div>
    </div>
</template>
<script>
    import CardJurados from '../components/Juradostestigos/CardJurados'
    import CardTestigos from '../components/Juradostestigos/CardTestigos'
    export default {
        components:{
            CardJurados,
            CardTestigos
        },
        data() {
            return {
                option: 0
            }
        },
        methods: {
            setOption(){
                console.log('no se')
            }
        },
    }
</script>
<style lang="scss">
</style>