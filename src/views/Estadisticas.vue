<template>
    <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">        
        <div class="container row">
            <div class="col-12 col-md-6">
                <label for="estadistica_id">Estadísticas</label>
                <b-form-select id="estadistica_id" v-model="estadistica_id" :options="estadisticas">
                    <template #first>
                        <b-form-select-option :value="null" disabled>-- Selecciona una opción --</b-form-select-option>
                    </template>
                </b-form-select>
            </div>
        </div>
        <!-- <EstadisticasLocales2019 v-if="estadistica_id === 1" /> -->
        <EstadisticasLocales2022 v-if="estadistica_id === 2" />
        <EstadisticasLocales2023 v-if="estadistica_id === 3" />
    </a-card>
</template>
<script>

    import EstadisticasLocales2019 from './Estadisticas2019.vue';
    import EstadisticasLocales2022 from './Estadisticas2022.vue';
    import EstadisticasLocales2023 from './Estadisticas2023.vue';

    export default {
        components: {
			EstadisticasLocales2019,
            EstadisticasLocales2022,
			EstadisticasLocales2023,
		},
        data(){
            return{
                estadistica_id: null,
                estadisticas: [
                    // {text: 'Estadísticas locales 2019', value: 1},
                    {text: 'Estadísticas Congreso 2022', value: 2},
                    {text: 'Estadísticas locales 2023', value: 3},
                ]
            }
        },
        methods: {
            
        },
    }
</script>