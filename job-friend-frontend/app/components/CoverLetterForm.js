'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = 'http://localhost:8000';

async function generateCoverLetter(data) {
  console.log('generateCoverLetter data:', data);

  const formData = new FormData();
  formData.append('job_description', new Blob([data.job_description], { type: 'text/plain' }), 'job_description.txt');
  
  if (data.resume instanceof File) {
    formData.append('resume', data.resume, data.resume.name);
    console.log('Resume appended to FormData');
  } else {
    console.error('Resume file is missing or invalid');
    throw new Error('Please upload a valid resume file.');
  }
  
  formData.append('cover_letter_size', data.cover_letter_size);
  formData.append('formality', data.formality.toString());
  if (data.additional_params) {
    formData.append('additional_params', data.additional_params);
  }

  console.log('Form data being sent:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/generate_cover_letter`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Axios error:', error.response?.data);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
    if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.detail || [];
      if (Array.isArray(validationErrors)) {
        throw new Error(validationErrors.map(err => `${err.loc.join('.')} - ${err.msg}`).join(', '));
      } else {
        throw new Error(error.response.data.detail || 'Validation error occurred');
      }
    } else if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

const CoverLetterForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    setLoading(true);
    setError('');
    try {
      if (!data.resume || data.resume.length === 0) {
        throw new Error('Please upload a resume file.');
      }
      const file = data.resume[0];
      console.log('File object:', file);
      console.log('File type:', file.type);
      console.log('File size:', file.size);

      // Check if the file is a PDF
      if (file.type !== 'application/pdf') {
        throw new Error('Please upload a valid PDF file.');
      }

      // Check if the file size is reasonable (e.g., less than 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('The PDF file is too large. Please upload a file smaller than 5MB.');
      }

      // Read the first few bytes of the file to check for PDF signature
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arr = new Uint8Array(e.target.result).subarray(0, 4);
        const header = Array.from(arr).map(byte => byte.toString(16)).join('');
        console.log('File header:', header);
        
        if (header !== '25504446') {
          throw new Error('The file does not appear to be a valid PDF.');
        }

        try {
          const response = await generateCoverLetter({
            job_description: data.job_description,
            resume: file,
            cover_letter_size: data.cover_letter_size,
            formality: data.formality,
            additional_params: data.additional_params
          });
          setCoverLetter(response.cover_letter);
        } catch (err) {
          console.error(err);
          setError(err.message || 'An unexpected error occurred.');
        }
      };
      reader.readAsArrayBuffer(file.slice(0, 4));
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Generate Your Cover Letter</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Job Description */}
        <div>
          <label className="block text-gray-700">Job Description:</label>
          <textarea
            {...register('job_description', { required: 'Job description is required' })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows="5"
          ></textarea>
          {errors.job_description && <span className="text-red-500">{errors.job_description.message}</span>}
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-gray-700">Resume (PDF):</label>
          <input
            type="file"
            accept=".pdf"
            {...register('resume', { 
              required: 'Resume is required',
              validate: (value) => value[0] instanceof File || 'Please upload a valid file'
            })}
            className="mt-1 block w-full"
          />
          {errors.resume && <span className="text-red-500">{errors.resume.message}</span>}
        </div>

        {/* Cover Letter Size */}
        <div>
          <label className="block text-gray-700">Cover Letter Size:</label>
          <select
            {...register('cover_letter_size', { required: 'Cover letter size is required' })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="small">Small (~180 words)</option>
            <option value="large">Large (~360 words)</option>
          </select>
          {errors.cover_letter_size && <span className="text-red-500">{errors.cover_letter_size.message}</span>}
        </div>

        {/* Formality Level */}
        <div>
          <label className="block text-gray-700 mb-2">
            Formality Level: <span className="font-medium">{watch('formality', 0.5)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            {...register('formality', { required: true })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {coverLetter && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Generated Cover Letter:</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{coverLetter}</pre>
          <button
            onClick={() => {
              const element = document.createElement("a");
              const file = new Blob([coverLetter], {type: 'text/plain'});
              element.href = URL.createObjectURL(file);
              element.download = "cover_letter.txt";
              document.body.appendChild(element);
              element.click();
            }}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 flex items-center"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Download as TXT
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverLetterForm;
