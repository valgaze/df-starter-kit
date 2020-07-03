import serviceaccount from "./service-account.json";
const { project_id } = serviceaccount;
const credentials = serviceaccount;

export default {
  port: "8000",
  webhook: "/webhook",
  backend: "/chat",
  project_id,
  credentials,
};
