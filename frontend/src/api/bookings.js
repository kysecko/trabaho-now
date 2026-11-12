import http from "./client"; 

const bookings = {
  // lifecycle
  list: (status) => http.get(`/requests${status ? `?status=${status}` : ""}`),
  show: (id) => http.get(`/requests/${id}`),
  accept: (id) => http.post(`/requests/${id}/accept`),
  decline: (id, payload) => http.post(`/requests/${id}/decline`, payload),
  complete: (id) => http.post(`/requests/${id}/complete`),

  // cancellation
  cancel: (id, { reason, note }) =>
    http.post(`/requests/${id}/cancel`, { reason, note }),

  // chat
  messages: (id) => http.get(`/requests/${id}/messages`),
  sendMessage: (id, body) => http.post(`/requests/${id}/messages`, { body }),
};

export default bookings;