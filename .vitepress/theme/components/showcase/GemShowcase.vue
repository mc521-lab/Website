<script setup lang="ts">
    import { data } from "@data/gems.data";

    const { gems } = data;

    const qualityOrder = ["c", "b", "a", "s"];
    const qualityName = { c: "C", b: "B", a: "A", s: "S" };

    function formatValue(value: number | number[] | null): string {
        if (value === null) return "-";
        if (Array.isArray(value)) {
            return value.map((v) => (v === null ? "?" : v)).join(" ~ ");
        }
        return String(value);
    }
</script>

<template>
    <section class="showcase">
        <article v-for="gem in gems" :key="gem.id" class="card">
            <header class="card-header">
                <span class="symbol" :style="{ borderColor: gem.symbolColor, backgroundColor: gem.symbolColor + '18' }">
                    {{ gem.name.charAt(0) }}
                </span>
                <h3 class="card-title">{{ gem.name }}</h3>
            </header>

            <table class="quality-table">
                <thead>
                    <tr>
                        <th>品质</th>
                        <th>说明</th>
                        <th v-for="feature in gem.features" :key="feature.id">{{ feature.name }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="q in gem.qualitys
                            .slice()
                            .sort((a, b) => qualityOrder.indexOf(a.id) - qualityOrder.indexOf(b.id))"
                        :key="q.id">
                        <td class="quality-cell">{{ qualityName[q.id as keyof typeof qualityName] }} 级</td>
                        <td class="desc-cell">{{ q.description }}</td>
                        <td v-for="feature in gem.features" :key="feature.id">
                            <template v-if="q.features.find((f) => f.id === feature.id)">
                                {{ formatValue(q.features.find((f) => f.id === feature.id)!.value) }}
                            </template>
                            <template v-else>-</template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </article>
    </section>
</template>

<style scoped>
    .showcase {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
    .card {
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }
    .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 14px;
    }
    .symbol {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid;
        font-weight: 700;
        font-size: 1rem;
        color: #1a1612;
    }
    .card-title {
        font-size: 1.1rem;
        margin: 0;
        color: #1a1612;
    }
    .quality-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
    }
    .quality-table th,
    .quality-table td {
        padding: 8px 10px;
        text-align: left;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }
    .quality-table th {
        color: #7c6b55;
        font-weight: 500;
    }
    .quality-table td {
        color: #1a1612;
    }
    .quality-cell {
        font-weight: 600;
        white-space: nowrap;
    }
    .desc-cell {
        color: #5c4d3d;
    }
</style>
