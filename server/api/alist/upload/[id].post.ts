import { defineEventHandler, readMultipartFormData, createError } from "h3";
import { uploadBufferToAlist } from "~~/server/modules/AlistAPI";

export default defineEventHandler(async (event) => {
    // 1. 从 URL 获取文件名 (并解码)
    const filename = event.context.params?.id;
    if (!filename) {
        throw createError({
            statusCode: 400,
            statusMessage: "请求错误：URL 中缺少文件名。",
        });
    }
    const decodedFilename = decodeURIComponent(filename);

    // 2. 从请求体中读取文件数据
    const multipartFormData = await readMultipartFormData(event);
    const fileData = multipartFormData?.find((el) => el.name === "file");

    if (!fileData?.data) {
        throw createError({
            statusCode: 400,
            statusMessage: "请求错误：缺少文件数据。",
        });
    }

    // 3. 调用独立的 Alist 服务执行上传
    // Nuxt 会自动找到并导入 `uploadBufferToAlist` 函数
    const [result, uploadError] = await uploadBufferToAlist(fileData.data, decodedFilename);

    // 4. 根据服务返回的结果，向前端响应
    if (uploadError) {
        // 如果 Alist 服务返回错误，创建一个服务器内部错误
        throw createError({
            statusCode: 502, // 502 Bad Gateway 表明作为网关或代理的服务器，从上游服务器收到了无效的响应
            statusMessage: uploadError,
        });
    }

    // 成功，返回结果
    return {
        success: true,
        data: result,
    };
});
