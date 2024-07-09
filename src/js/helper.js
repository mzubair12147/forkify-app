// This file contain helper functions that we use over and over in the project
import { TIMEOUT_SECONDS } from './config';
import { async } from 'regenerator-runtime';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} second`)
            );
        }, s * 1000);
    });
};

export const AJAX = async function (url, uploadData = undefined) {
    try {
        const fetchPro = !uploadData
            ? fetch(url)
            : fetch(url, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/JSON',
                  },
                  body: JSON.stringify(uploadData),
              });
        const response = await Promise.race([
            fetchPro,
            timeout(TIMEOUT_SECONDS),
        ]);
        const data = await response.json();
        if (!response.ok)
            throw new Error(
                `The server responded with error: ${data.message} ${response.status}`
            );

        return data.data;
    } catch (error) {
        throw error;
    }
};

// export async function getJSON(url) {
//     try {
//         const response = await Promise.race([
//             fetch(url),
//             timeout(TIMEOUT_SECONDS),
//         ]);
//         const data = await response.json();
//         if (!response.ok)
//             throw new Error(
//                 `The server responded with error: ${data.message} ${response.status}`
//             );

//         return data.data;
//     } catch (error) {
//         throw error;
//     }
// }

// export async function sendJSON(url, uploadData) {
//     try {
//         const response = await Promise.race([
//             fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/JSON',
//                 },
//                 body: JSON.stringify(uploadData),
//             }),
//             timeout(TIMEOUT_SECONDS),
//         ]);
//         const data = await response.json();
//         if (!response.ok)
//             throw new Error(
//                 `The server responded with error: ${data.message} ${response.status}`
//             );

//         return data;
//     } catch (error) {
//         throw error;
//     }
// }
