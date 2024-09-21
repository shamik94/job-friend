import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export default async function generateCoverLetter(data) {
  const formData = new FormData();
  formData.append('job_description', data.job_description);
  formData.append('resume', data.resume[0]); // Assuming resume is a FileList
  formData.append('cover_letter_size', data.cover_letter_size);
  formData.append('formality', data.formality.toString());
  if (data.additional_params) {
    formData.append('additional_params', data.additional_params);
  }

  const response = await axios.post(`${API_BASE_URL}/generate_cover_letter`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
