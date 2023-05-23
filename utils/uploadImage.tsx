import mime from 'mime';
import requestApi from './request';

function readFile(file: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise(function (resolve, reject) {
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function () {
            reject(reader.error);
        };
    });
}

export default async function uploadImage(url: string) {
    const blob = await (await fetch(url)).blob();
    const fileType = mime.getType(url);
    const fileName = 'image.' + mime.getExtension(fileType!);

    return await requestApi('post', '/uploadImage', { file: await readFile(blob), fileName }, true, '上传图片失败');
}