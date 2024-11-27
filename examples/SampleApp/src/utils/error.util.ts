import { ApiError } from '../model';

export function extractApiError(error: ApiError) {
  if ((error.status || error.response?.status) === 500) {
    return 'There was an error submitting your information. Please try again later';
  }

  const errorResponse = error.response?.data;

  if (!errorResponse) {
    return error.message;
  }

  if (errorResponse.message && Object.keys(errorResponse).length === 1) {
    return errorResponse.message;
  }

  return errorResponse;
}
