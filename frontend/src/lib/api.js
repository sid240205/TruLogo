import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const analyzeLogo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/analyze/logo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const analyzeText = async (text) => {
    const formData = new FormData();
    formData.append('text', text);

    const response = await api.post('/analyze/text', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
};

export const generateLogo = async (data) => {
    // Send as JSON
    const response = await api.post('/generate/logo', data, {
        responseType: 'blob', // Expecting an image blob
    });
    return response.data;
};
