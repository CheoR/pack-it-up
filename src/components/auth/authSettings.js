/*
  If your json-server API URL or endpoint is different, please change it below!
  The Register and Login components assume your local JSON Server is running at
   port 8088 and that you have an endpoint for users. Both of these can be changed
    in the authApi.js in the auth directory.
*/
export const authApi = {
  localApiBaseUrl: "http://localhost:8088",
  endpoint: "users"
}

// The user id is saved under the key app_user_id in session Storage. Change below if needed!
export const userStorageKey = "app_user_id"
export const userStorageUserName = "app_user_username"
