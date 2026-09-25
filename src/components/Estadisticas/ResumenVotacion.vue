<template>
    <div class="voting-charts">
        <section class="voting-panel" aria-label="Votación por candidato">
            <h4>Detalle por candidato</h4>
            <p>Los 8 candidatos con mayor votación en la consulta</p>
            <div class="candidate-chart">
                <div v-for="(item, index) in candidates" :key="item.name" class="candidate-column">
                    <strong>{{ format(item.votes) }}</strong>
                    <div class="candidate-track"><div class="candidate-bar" :style="{ height: percent(item.votes, candidates) + '%', background: colors[index % colors.length] }"></div></div>
                    <span :title="item.name">{{ item.name }}</span>
                </div>
            </div>
            <span class="chart-axis">Candidato · Votación</span>
        </section>
        <section class="voting-panel" aria-label="Distribución de votos">
            <div class="territory-heading">
                <h4>Distribución de votos</h4>
                <select v-model="group" aria-label="Agrupar distribución de votos">
                    <option v-for="option in groups" :key="option.key" :value="option.key">{{ option.label }}</option>
                </select>
            </div>
            <p>Los 10 resultados con mayor votación en la consulta</p>
            <div class="territory-chart">
                <div v-for="item in territories" :key="item.name" class="territory-row">
                    <span :title="item.name">{{ item.name }}</span>
                    <div class="territory-track"><div :style="{ width: percent(item.votes, territories) + '%' }"></div></div>
                    <strong>{{ format(item.votes) }}</strong>
                </div>
            </div>
            <span class="chart-axis">Votación</span>
        </section>
    </div>
</template>

<script>
export default {
    props: {
        rows: { type: Array, default: () => [] },
        year: { type: Number, required: true }
    },
    data() {
        return { group: 'partido', colors: ['#87516e', '#89947c', '#746965', '#b47c64', '#777d91', '#b1a27f', '#617c78', '#a47887'] }
    },
    computed: {
        groups() {
            return [
                { key: 'partido', label: 'Partido' },
                { key: 'municipio', label: 'Municipio' },
                { key: 'comuna', label: 'Comuna' },
                { key: this.year === 2023 ? 'puesto' : 'PUESNOMBRE', label: 'Puesto' }
            ].filter(option => this.rows.some(row => row[option.key] != null && row[option.key] !== ''))
        },
        candidates() {
            return this.aggregate(this.year === 2023 ? 'candidato' : 'CANNOMBRE', 8)
        },
        territories() {
            return this.aggregate(this.group, 10)
        }
    },
    watch: {
        groups: {
            immediate: true,
            handler(options) {
                if (!options.some(option => option.key === this.group)) this.group = options.length ? options[0].key : 'partido'
            }
        }
    },
    methods: {
        aggregate(key, limit) {
            const totals = new Map()
            this.rows.forEach(row => {
                const name = String(row[key] || 'Sin información')
                const votes = Number(this.year === 2023 ? row.votacion : row.total)
                totals.set(name, (totals.get(name) || 0) + (Number.isFinite(votes) ? votes : 0))
            })
            return Array.from(totals, ([name, votes]) => ({ name, votes })).sort((a, b) => b.votes - a.votes).slice(0, limit)
        },
        percent(votes, items) { return items.length && items[0].votes > 0 ? Math.max(0, votes / items[0].votes * 100) : 0 },
        format(value) { return new Intl.NumberFormat('es-CO').format(value) }
    }
}
</script>
