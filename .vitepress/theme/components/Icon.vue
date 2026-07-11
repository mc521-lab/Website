<script setup lang="ts">
    export type IconName =
        | "home"
        | "wiki"
        | "skin"
        | "sword"
        | "log"
        | "leaf"
        | "shield"
        | "landmark"
        | "gift"
        | "message"
        | "globe"
        | "users"
        | "menu"
        | "star"
        | "command"
        | "map"
        | "coin"
        | "video"
        | "chest"
        | "arrow-up"
        | "check-circle"
        | "wallet"
        | "help-circle"
        | "alert-triangle"
        | "book"
        | "gem"
        | "apple"
        | "briefcase"
        | "hammer"
        | "chevron-down"
        | "search";

    defineProps<{
        name: IconName;
        size?: number | string;
    }>();

    enum ViewBox {
        Leaf = "0 0 36 36",
        _Default = "0 0 24 24",
    }

    const DefaultSize = 20;
</script>

<template>
    <svg
        class="jtg-icon"
        :width="size ?? DefaultSize"
        :height="size ?? DefaultSize"
        :viewBox="name === 'leaf' ? ViewBox.Leaf : ViewBox._Default"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <!-- home -->
        <template v-if="name === 'home'">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </template>

        <!-- wiki / book-open -->
        <template v-else-if="name === 'wiki'">
            <path d="M12 7v14" />
            <path
                d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
        </template>

        <!-- skin / sparkles -->
        <template v-else-if="name === 'skin'">
            <path
                d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </template>

        <!-- sword -->
        <template v-else-if="name === 'sword'">
            <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
            <path d="m13 19 6-6" />
            <path d="m16 16 4 4" />
            <path d="m19 21 2-2" />
        </template>

        <!-- log / clipboard-list -->
        <template v-else-if="name === 'log'">
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M12 11h4" />
            <path d="M12 16h4" />
            <path d="M8 11h.01" />
            <path d="M8 16h.01" />
        </template>

        <!-- leaf -->
        <template v-else-if="name === 'leaf'">
            <path
                d="M36 20.917c0-.688-2.895-.5-3.125-1s3.208-4.584 2.708-5.5s-5.086 1.167-5.375.708c-.288-.458.292-3.5-.208-3.875s-5.25 4.916-5.917 4.292s1.542-10.5 1.086-10.698s-3.419 1.365-3.793 1.282C21.002 6.042 18.682 0 18 0s-3.002 6.042-3.376 6.125s-3.337-1.48-3.793-1.282s1.752 10.073 1.085 10.698C11.25 16.166 6.5 10.875 6 11.25s.08 3.417-.208 3.875c-.289.458-4.875-1.625-5.375-.708s2.939 5 2.708 5.5s-3.125.312-3.125 1s8.438 5.235 9 5.771s-2.914 2.802-2.417 3.229c.576.496 3.839-.83 10.417-.957V35a1 1 0 1 0 2 0v-6.04c6.577.127 9.841 1.453 10.417.957c.496-.428-2.979-2.694-2.417-3.229s9-5.084 9-5.771" />
        </template>

        <!-- shield -->
        <template v-else-if="name === 'shield'">
            <path
                d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </template>

        <!-- landmark / bank -->
        <template v-else-if="name === 'landmark'">
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4 8 4v14" />
            <path d="M10 10v10" />
            <path d="M14 10v10" />
            <path d="M7 10h10" />
        </template>

        <!-- gift -->
        <template v-else-if="name === 'gift'">
            <rect x="3" y="8" width="18" height="4" rx="1" />
            <path d="M12 8v13" />
            <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
            <path d="M7.5 8a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 2.5 2.5v2.5H7.5z" />
            <path d="M16.5 8h-2.5V5.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1-2.5 2.5z" />
        </template>

        <!-- message -->
        <template v-else-if="name === 'message'">
            <path d="m3 21 1.9-5.7a9 9 0 1 1 3.8 3.8z" />
        </template>

        <!-- globe -->
        <template v-else-if="name === 'globe'">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
        </template>

        <!-- users / qq group -->
        <template v-else-if="name === 'users'">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </template>

        <!-- star -->
        <template v-else-if="name === 'star'">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </template>

        <!-- command -->
        <template v-else-if="name === 'command'">
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </template>

        <!-- map -->
        <template v-else-if="name === 'map'">
            <polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
        </template>

        <!-- coin -->
        <template v-else-if="name === 'coin'">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v12" />
            <path d="M15 9.5a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3" />
        </template>

        <!-- video -->
        <template v-else-if="name === 'video'">
            <path d="m22 8.64-5.5-3.18a1 1 0 0 0-1 0L10 8.64a1 1 0 0 0-.5.87v6.18a1 1 0 0 0 .5.87l5.5 3.18a1 1 0 0 0 1 0l5.5-3.18a1 1 0 0 0 .5-.87V9.51a1 1 0 0 0-.5-.87z" />
            <polygon points="9 8 3 8 3 16 9 16 15 12 9 8" />
        </template>

        <!-- chest -->
        <template v-else-if="name === 'chest'">
            <path d="M20 12V8H4v4H2v8h20v-8h-2z" />
            <path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
            <path d="M12 12v6" />
            <path d="M8 12v6" />
            <path d="M16 12v6" />
        </template>

        <!-- arrow-up -->
        <template v-else-if="name === 'arrow-up'">
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
        </template>

        <!-- check-circle -->
        <template v-else-if="name === 'check-circle'">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </template>

        <!-- wallet -->
        <template v-else-if="name === 'wallet'">
            <path d="M20 12V8H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16v-4" />
            <path d="M18 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </template>

        <!-- help-circle -->
        <template v-else-if="name === 'help-circle'">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </template>

        <!-- alert-triangle -->
        <template v-else-if="name === 'alert-triangle'">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </template>

        <!-- book -->
        <template v-else-if="name === 'book'">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </template>

        <!-- gem -->
        <template v-else-if="name === 'gem'">
            <path d="M6 3h12l4 6-10 13L2 9z" />
            <path d="m12 22 4-13-4-7-4 7z" />
            <path d="M6 3h12" />
        </template>

        <!-- apple -->
        <template v-else-if="name === 'apple'">
            <path d="M12 20.94c1.8-1.2 3.5-3.1 3.5-6.4 0-2.7-1.5-5.1-3.5-5.7 0 .6-.3 1.2-.8 1.6-.4.3-.9.4-1.4.4s-1-.1-1.4-.4c-.5-.4-.8-1-.8-1.6-2 .6-3.5 3-3.5 5.7 0 3.3 1.7 5.2 3.5 6.4a9 9 0 0 0 6 0z" />
            <path d="M12 4.5c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3" />
        </template>

        <!-- briefcase -->
        <template v-else-if="name === 'briefcase'">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </template>

        <!-- hammer -->
        <template v-else-if="name === 'hammer'">
            <path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" />
            <path d="M17.5 9.5 21 6" />
            <path d="M13.5 5.5 17 2" />
            <path d="M19.5 11.5 23 8" />
        </template>

        <!-- chevron-down -->
        <template v-else-if="name === 'chevron-down'">
            <path d="m6 9 6 6 6-6" />
        </template>

        <!-- search -->
        <template v-else-if="name === 'search'">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </template>

        <!-- menu -->
        <template v-else-if="name === 'menu'">
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
        </template>
    </svg>
</template>

<style scoped>
    .jtg-icon {
        display: inline-block;
        flex-shrink: 0;
        vertical-align: middle;
    }
</style>
