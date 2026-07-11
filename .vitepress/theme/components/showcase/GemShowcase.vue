<script setup lang="ts">
    import { data } from "@data/gems.data";
    import type { WikiGemQuality, WikiGemQualityFeature } from "../../../types/wiki";
    import ShowcaseCard from "./ShowcaseCard.vue";

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

    function imageUrl(path: string | null): string | undefined {
        if (!path) return undefined;
        return `/wiki/itemwiki/${path}`;
    }
</script>

<template>
    <section class="showcase">
        <ShowcaseCard
            v-for="gem in gems"
            :key="gem.id"
            class="card"
            :title="gem.name"
            :image="imageUrl(gem.image)"
            icon="lucide:diamond">
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
                            .sort(
                                (a: WikiGemQuality, b: WikiGemQuality) =>
                                    qualityOrder.indexOf(a.id) - qualityOrder.indexOf(b.id)
                            )"
                        :key="q.id">
                        <td class="quality-cell">{{ qualityName[q.id as keyof typeof qualityName] }} 级</td>
                        <td class="desc-cell">{{ q.description }}</td>
                        <td v-for="feature in gem.features" :key="feature.id">
                            <template v-if="q.features.find((f: WikiGemQualityFeature) => f.id === feature.id)">
                                {{ formatValue(q.features.find((f: WikiGemQualityFeature) => f.id === feature.id)!.value) }}
                            </template>
                            <template v-else>-</template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </ShowcaseCard>
    </section>
</template>

<style scoped>
    .showcase {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
    .card {
        width: 100%;
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
