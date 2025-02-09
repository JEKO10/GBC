import { NotNullOrUndefined } from "../utils/NotNullOrUndefined";

function NotNullOrUndefinedWithEnv(envVariableName: string) {
  return NotNullOrUndefined(process.env[envVariableName], () => {
    throw new Error(`process.env.${envVariableName} must be defined !`);
  });
}

export const GOOGLE_MAP_API_KEY = "AIzaSyARzP2Da2YN8a5jYeb6CzyepnHmA7dSdnE";
// NotNullOrUndefinedWithEnv(
// "VITE_APP_GOOGLE_MAP_API_KEY"
// );

export const GOOGLE_MAP_ID = "dcd70950b6de58d";
//   NotNullOrUndefinedWithEnv(
//   "VITE_APP_GOOGLE_MAP_ID"
// );
