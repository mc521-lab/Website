const fs = require("fs");
const path = require("path");
const axios = require("axios");
const glob = require("glob");

// 工作目录
const cwd = process.cwd();
const wikiDir = path.join(cwd, "content", "wiki");
const publicDir = path.join(cwd, "public", "assets", "wiki");

// 匹配 Markdown 中的图片 URL
const imgRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;

// 获取所有 Markdown 文件
const files = glob.sync(`${wikiDir}/**/*.md`);

files.forEach((mdPath) => {
    let mdContent = fs.readFileSync(mdPath, "utf-8");

    const matches = [...mdContent.matchAll(imgRegex)];
    if (!matches.length) return;

    // Markdown 文件相对于 content/wiki 的路径
    const relativeFilePath = path.relative(wikiDir, mdPath); // e.g., path/to/file.md
    const fileNameWithoutExt = path.parse(relativeFilePath).name; // e.g., file

    // 每个 Markdown 文件的图片目录
    const targetDir = path.join(publicDir, path.dirname(relativeFilePath), fileNameWithoutExt);
    fs.mkdirSync(targetDir, { recursive: true });

    matches.forEach((match) => {
        const url = match[1];
        const filename = url.split("/").pop();
        const targetPath = path.join(targetDir, filename);

        if (!fs.existsSync(targetPath)) {
            // 下载图片
            axios
                .get(url, { responseType: "arraybuffer", timeout: 10000 })
                .then((resp) => {
                    fs.writeFileSync(targetPath, resp.data);
                    console.log(`Downloaded ${url} -> ${targetPath}`);
                })
                .catch((err) => {
                    console.error(`Failed to download ${url}: ${err.message}`);
                });
        } else {
            console.log(`Skipped (exists) ${targetPath}`);
        }

        // 替换 Markdown 中的 URL
        const newUrl = `/assets/wiki/${path.join(path.dirname(relativeFilePath), fileNameWithoutExt, filename).replace(/\\/g, "/")}`;
        mdContent = mdContent.replace(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), newUrl);
    });

    fs.writeFileSync(mdPath, mdContent, "utf-8");
    console.log(`Updated ${mdPath}`);
});
