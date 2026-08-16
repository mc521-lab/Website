export function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => {
            reject(reader.error ?? new Error("failed to read blob"));
        };
        reader.onload = () => {
            resolve(String(reader.result));
        };

        reader.readAsDataURL(blob);
    });
}
