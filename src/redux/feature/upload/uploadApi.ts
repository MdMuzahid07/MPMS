import baseApi from "../../api/baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<
      { secure_url: string; public_id: string },
      FormData
    >({
      query: (body) => ({
        url: `/upload/image`,
        method: "POST",
        body,
      }),
      transformResponse: (response: {
        data: { secure_url: string; public_id: string };
      }) => response.data,
    }),
    uploadAttachment: builder.mutation<
      { secure_url: string; public_id: string; original_filename: string },
      FormData
    >({
      query: (body) => ({
        url: `/upload/attachment`,
        method: "POST",
        body,
      }),
      transformResponse: (response: {
        data: {
          secure_url: string;
          public_id: string;
          original_filename: string;
        };
      }) => response.data,
    }),
  }),
});

export const { useUploadImageMutation, useUploadAttachmentMutation } =
  uploadApi;
