import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const concernReceiverApi = createApi({
  reducerPath: "concernReceiverApi",
  tagTypes: ["Receiver Concern"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASEURL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);

      return headers;
    },
    paramsSerializer: (params) => {
      return queryString.stringify(params, {
        skipNull: true,
      });
    },
  }),
  endpoints: (builder) => ({
    // RECEIVER ---------------
    getReceiverConcerns: builder.query({
      query: (params) => ({
        url: "request-concern/page?Approval=false&Status=true&Reject=false&Approver=Approver",
        method: "GET",
        params: params,
      }),
      providesTags: ["Receiver Concern"],
    }),
  }),
});

export const { useGetReceiverConcernsQuery } = concernReceiverApi;
