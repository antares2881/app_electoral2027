<template>
    <a-card :bordered="false" class="header-solid h-full vista-estadisticas" :bodyStyle="{padding: '1.25rem'}">        
        <div class="caja-estadisticas">
            <div class="campo-estadisticas">
                <label for="estadistica_id">Estadísticas</label>
                <b-form-select class="selector-estadisticas" id="estadistica_id" v-model="estadistica_id" :options="estadisticas">
                    <template #first>
                        <b-form-select-option :value="null" disabled>-- Selecciona una opción --</b-form-select-option>
                    </template>
                </b-form-select>
            </div>
        </div>
        <!-- <EstadisticasLocales2019 v-if="estadistica_id === 1" /> -->
        <EstadisticasLocales2022 v-if="estadistica_id === 2" />
        <EstadisticasLocales2023 v-if="estadistica_id === 3" />
        <EstadisticasCongreso2026 v-if="estadistica_id === 4" />
    </a-card>
</template>
<script>

    import EstadisticasLocales2019 from './Estadisticas2019.vue';
    import EstadisticasLocales2022 from './Estadisticas2022.vue';
    import EstadisticasLocales2023 from './Estadisticas2023.vue';

    import EstadisticasCongreso2026 from './Estadisticas2026.vue';

    export default {
        components: {
            EstadisticasCongreso2026,
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
                    {text: 'Estadísticas Congreso 2026', value: 4},
                ]
            }
        },
        methods: {
            
        },
    }
</script>
<style scoped>
.caja-estadisticas {
    padding: 1.25rem;
    margin-bottom: 1.25rem;
    background: #f8faf9;
    border: 1px solid #e1e8e4;
    border-radius: 12px;
}
.campo-estadisticas { width: 100%; max-width: 640px; }
.campo-estadisticas label {
    display: block;
    margin-bottom: 0.4rem;
    color: #475569;
    font-size: 0.875rem;
    font-weight: 600;
}
.selector-estadisticas {
    display: block;
    width: 100%;
    height: 44px;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    background-color: #fff;
    color: #334155;
    border: 1px solid #d8e0dc;
    border-radius: 8px;
    font-size: 0.95rem;
}
.selector-estadisticas:focus {
    border-color: #198754;
    box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.12);
    outline: none;
}
@media (max-width: 767px) {
    .caja-estadisticas { padding: 1rem; }
}
</style>
