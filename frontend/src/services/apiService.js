
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const backendService = {
    /**
     * Sends the logo file to the Python backend for analysis.
     * @param {File} file 
     * @returns {Promise<Object>} Backend analysis result (risk, heatmap, etc.)
     */
    analyzeLogo: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_BASE_URL}/analyze/logo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Backend Analysis Error:", error);
            // Return null so the UI knows the backend failed but doesn't crash
            return null;
        }
    }
};
