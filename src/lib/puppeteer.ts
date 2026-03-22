// lib/puppeteer.ts
import puppeteer, { Browser } from "puppeteer";
import pLimit from "p-limit";

let browser: Browser | null = null;

// 并发限制：同时最多 3 个 Page
const limit = pLimit(3);

async function getBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
    }
    return browser;
}

export async function fetchSkin(id: string) {
    return limit(async () => {
        const browser = await getBrowser();
        const page = await browser.newPage();

        try {
            const url = `https://s.namemc.com/i/${id}.png`;
            const response = await page.goto(url, { waitUntil: "networkidle2" });

            if (!response) throw new Error("no response");

            const buffer = await response.buffer();
            return buffer;
        } finally {
            await page.close(); // ✅ 只关 page，不关 browser
        }
    });
}

// optional: graceful shutdown
export async function closeBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
    }
}
