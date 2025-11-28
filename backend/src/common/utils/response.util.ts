export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | null;
}

export const buildResponse = <T = any>(
  success: boolean,
  message: string,
  data: T | null = null,
): ApiResponse<T> => {
  return { success, message, data };
};
