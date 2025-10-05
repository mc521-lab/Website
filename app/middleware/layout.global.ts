export default defineNuxtRouteMiddleware((to) => {
    // 仅当路径以 /wiki/w 开头时使用 wiki 布局
    if (to.path.startsWith("/wiki/w")) {
        to.meta.layout = "wiki";
    } else {
        to.meta.layout = "default";
    }
});
