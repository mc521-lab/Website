import axios from "axios";

/**
 * 上传文件 Buffer 到 Alist.
 * 这是一个专为服务器端设计的函数，它接收 Buffer 而不是浏览器端的 File 对象。
 * @param fileBuffer - 文件的 Buffer 数据.
 * @param filename - 要在 Alist 中保存的文件名.
 * @returns [成功响应数据 | null, 错误信息 | null]
 */
export async function uploadBufferToAlist(fileBuffer: Buffer, filename: string): Promise<[any | null, string | null]> {
    // 从运行时配置中获取 Alist 的凭证和地址
    const config = useRuntimeConfig();
    const { alistUsername, alistPassword } = config;
    const { alistUrl } = config.public;

    // 基础输入验证
    if (!alistUrl || !alistUsername || !alistPassword) {
        return [null, "服务器 Alist 配置不完整，请联系管理员"];
    }
    if (!fileBuffer || !filename) {
        return [null, "输入不完整 (fileBuffer 或 filename)"];
    }

    // 创建专用的 Axios 实例
    const httpClient = axios.create({
        baseURL: alistUrl.endsWith("/") ? alistUrl : alistUrl + "/",
    });

    try {
        // 1. 登录
        const loginResponse = await httpClient.post(
            `/api/auth/login`,
            {
                username: alistUsername,
                password: alistPassword,
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        const token = loginResponse.data?.data?.token;
        if (!token) {
            throw new Error("登录失败（未获取到token）");
        }

        // 2. 上传文件 (使用 PUT 方法，更适合在后端转发 Buffer)
        const uploadResponse = await httpClient.put(
            `/api/fs/put`,
            fileBuffer, // 直接将 Buffer 作为请求体
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/octet-stream", // 指定内容类型为二进制流
                    "File-Path": "/" + encodeURIComponent(filename), // Alist 通过这个头来获取文件名和路径
                },
                // 对于大文件，可能需要增加超时时间
                // timeout: 300000,
            }
        );

        return [uploadResponse.data, null];
    } catch (error) {
        // 统一处理错误，使其更易于调试
        let errorMessage: string;
        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = String(error);
        }
        console.error(`上传到 Alist 失败: ${errorMessage}`);
        return [null, `上传到 Alist 失败: ${errorMessage}`];
    }
}
