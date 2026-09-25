<template>
    <b-modal ref="modal-repetidos" hide-footer title="Votantes repetidos" size="lg">
        <b-alert variant="danger" show>
            <b-icon icon="exclamation-diamond-fill"></b-icon>
            Atencion este votante ya fue ingresado al sistema por las siguientes campañas.
        </b-alert>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Campaña</th>
                        <th>Lider</th>
                        <th>Sub Lider</th>
                        <th>Votante</th>
                        <th>Fecha de ingreso</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in repetidos" :key="index">
                        <td>{{ item.nombre_candidato }}</td>
                        <td>{{ item.nombre_lider }}</td>
                        <td>{{ item.nombres_sublider }} {{ item.apellidos_sublider }}</td>
                        <td>{{ item.nombres }} {{item.apellidos}}</td>
                        <td>{{ formatFecha(item.created_at) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </b-modal>
</template>
<script>

import axios from "axios";

export default {
    data() {
        return{
            render: false,
            repetidos: []
        }
    },
    methods: {
        formatFecha(fecha){
            return new Date(fecha).toLocaleDateString('es-co', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
        },
        showRepetidos(item){
            this.repetidos = item
            this.$refs['modal-repetidos'].show()
        },
    }
}
</script>
<style scoped>
    .b-icon.bi{
        font-size: 2rem;
        font-weight: bold;
    }
</style>