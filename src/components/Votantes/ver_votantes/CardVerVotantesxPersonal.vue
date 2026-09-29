<template>
    <div>
        <div v-if="data.length > 0" class="contenedor-principal">
            <div class="contenedor-tabla">
                <div class="mb-3">
                    <input 
                        type="text" 
                        v-model="filtro" 
                        class="form-control" 
                        placeholder="Buscar por nombre del lider/coordinador..."
                    />
                </div>
                <div class="tabla-wrapper">
                    <table class="table">
                        <thead>
                            <tr class="text-center">
                                <th>Item</th>
                                <th>{{ (data[0].opcion == 2)?'Lider':'Coordinador' }}</th>
                                <th>Meta</th>
                                <th>#Ingresados</th>
                                <th>% del total mostrado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in datosFiltrados" :key="index" class="text-center">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.nombres }} {{ item.apellidos }}</td>
                                <td>{{ formatearNumero(item.meta_votantes) }}</td>
                                <td>{{ formatearNumero(item.votantes) }}</td>
                                <td class="celda-porcentaje">
                                    <div class="peso-personal">
                                        <div class="pista-progreso" role="progressbar" :aria-label="`Participación de ${item.nombres}`" :aria-valuenow="porcentaje(item)" aria-valuemin="0" aria-valuemax="100">
                                            <div class="barra-progreso" :style="{ width: porcentaje(item) + '%' }"></div>
                                        </div>
                                        <strong>{{ formatearPorcentaje(porcentaje(item)) }}</strong>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="text-center">
                                <td></td>
                                <th>Total</th>
                                <th>{{ formatearNumero(totalProyectado) }}</th>
                                <th>{{ formatearNumero(totalVotantes) }}</th>
                                <th>{{ totalVotantes > 0 ? '100 %' : '0 %' }}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>        

        </div>
        <div v-else>
            <p class="alert alert-info">La consulta no arrojo datos</p>
        </div>


    </div>
</template>
<script>
export default {
    props: ['data'],
    data() { return { filtro: '' }; },
    methods: {
        formatearNumero(numero) {
            return new Intl.NumberFormat('es-CO').format(Number(numero) || 0);
        },
        porcentaje(item) {
            return this.totalVotantes > 0 ? (Number(item.votantes) || 0) / this.totalVotantes * 100 : 0;
        },
        formatearPorcentaje(valor) {
            return `${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(valor)} %`;
        }
    },
    computed: {
        datosFiltrados() {
            const filtro = this.filtro.toLowerCase();
            return this.data.filter(item => `${item.nombres || ''} ${item.apellidos || ''}`.toLowerCase().includes(filtro))
                .sort((a, b) => (Number(b.votantes) || 0) - (Number(a.votantes) || 0));
        },
        totalProyectado() {
            return this.datosFiltrados.reduce((total, item) => total + (Number(item.meta_votantes) || 0), 0);
        },
        totalVotantes() {
            return this.datosFiltrados.reduce((total, item) => total + (Number(item.votantes) || 0), 0);
        }
    }
}
</script>
<style scoped>
    .contenedor-tabla { min-width: 0; }
    .celda-porcentaje { min-width: 220px; width: 30%; }
    .peso-personal { display: flex; align-items: center; gap: 12px; }
    .peso-personal strong { min-width: 65px; text-align: right; color: #166534; font-variant-numeric: tabular-nums; }
    .pista-progreso { flex: 1; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden; }
    .barra-progreso { height: 100%; background: #198754; border-radius: 6px; transition: width 0.2s ease; }

    /* Contenedor principal */
    .contenedor-principal {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 20px;
        width: 100%;
        padding: 20px;
    }


    /* Contenedor de tabla - Ocupa todo el ancho disponible */
    .contenedor-tabla {
        width: 100%;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 20px;
    }

    /* Estilos del buscador */
    .mb-3 input.form-control {
        border: 2px solid #22c55e;
        border-radius: 8px;
        padding: 12px 15px;
        font-size: 14px;
        transition: all 0.3s ease;
        width: 100%;
    }

    .mb-3 input.form-control:focus {
        outline: none;
        border-color: #16a34a;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }

    /* Wrapper de tabla con scroll */
    .tabla-wrapper {
        width: 100%;
        overflow-x: auto;
        overflow-y: auto;
        max-height: 500px;
        margin-top: 15px;
    }

    /* Estilos de la tabla */
    .table {
        width: 100%;
        margin: 0;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 14px;
    }

    .table thead {
        position: sticky;
        top: 0;
        z-index: 10;
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }

    .table thead th {
        color: white !important;
        font-weight: 600;
        padding: 14px 15px;
        text-transform: uppercase;
        font-size: 13px;
        letter-spacing: 0.5px;
        border: none;
        background: transparent;
    }

    .table thead th:first-child {
        border-top-left-radius: 8px;
    }

    .table thead th:last-child {
        border-top-right-radius: 8px;
    }

    .table tbody tr {
        transition: all 0.2s ease;
        background: white;
    }

    .table tbody tr:hover {
        background: #f0fdf4;
        transform: scale(1.005);
    }

    .table tbody td {
        padding: 12px 15px;
        border-bottom: 1px solid #e5e7eb;
        vertical-align: middle;
        color: #374151;
    }

    .table tfoot {
        position: sticky;
        bottom: 0;
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        font-weight: 600;
        border-top: 3px solid #22c55e;
    }

    .table tfoot th,
    .table tfoot td {
        padding: 14px 15px;
        border: none;
        color: #166534;
        font-size: 15px;
    }

    /* Alerta de sin datos */
    .alert-info {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border: 2px solid #3b82f6;
        border-radius: 12px;
        padding: 20px;
        font-size: 16px;
        color: #1e40af;
        text-align: center;
        margin: 20px;
    }

    /* Responsive para pantallas menores a 992px */
    @media (max-width: 992px) {
        .contenedor-principal {
            grid-template-columns: 1fr;
            gap: 15px;
            padding: 15px;
        }

        .contenedor-tabla {
            padding: 15px;
        }

        .tabla-wrapper {
            max-height: 400px;
        }

        .table {
            font-size: 13px;
        }

        .table thead th,
        .table tbody td,
        .table tfoot th,
        .table tfoot td {
            padding: 10px 8px;
        }

        .mb-3 input.form-control {
            font-size: 13px;
            padding: 10px 12px;
        }




    }

    /* Responsive para móviles (menor a 576px) */
    @media (max-width: 576px) {
        .contenedor-principal {
            padding: 10px;
        }

        .contenedor-tabla {
            padding: 10px;
        }

        .tabla-wrapper {
            max-height: 350px;
        }

        .table {
            font-size: 11px;
        }

        .table thead th {
            font-size: 10px;
            padding: 8px 5px;
        }

        .table tbody td,
        .table tfoot th,
        .table tfoot td {
            padding: 8px 5px;
        }

        .mb-3 input.form-control {
            font-size: 12px;
            padding: 8px 10px;
        }






    }
</style>