<template>
    <span>
        <div class="row mb-3">
            <div class="col-12 col-md-6 mb-2" >
                <div
                    class="selector-box"
                    :class="{ active: option === 1 }"
                    @click="option = 1"
                >
                    Divipole
                </div>
            </div>
            <!-- <div class="col-12 col-md-6 mb-2" v-if="$store.state.user.role_id < 3">
                <div
                    class="selector-box"
                    :class="{ active: option === 2 }"
                    @click="option = 2"
                >
                    Comandos
                </div>
            </div> -->
        </div>
        <Asistentesxpuesto v-if="option===1" />
        <Asistentesxcomandos v-if="option===2" />
    </span>
</template>
<script>

    import Asistentesxpuesto from './Asistentesxpuestos.vue';
    import Asistentesxcomandos from './Asistentesxcomando.vue';

    export default{
        components: {
            Asistentesxpuesto, Asistentesxcomandos
        },
        data(){
            return{
                option: 0
            }
        },
        methods: {}
    }
</script>
<style scoped>
.selector-box {
    width: 100%;
    background: #6c757d;
    color: #fff;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 28px;
    line-height: 1.2;
    cursor: pointer;
    user-select: none;
    transition: background-color .2s ease, transform .2s ease;
}

.selector-box:hover {
    background: #5f6972;
}

.selector-box.active {
    background: #495057;
    transform: translateY(-1px);
}
</style>
