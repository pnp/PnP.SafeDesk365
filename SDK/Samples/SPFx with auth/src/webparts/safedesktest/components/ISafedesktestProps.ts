import { SafeDesk365 } from "safedesk365-sdk";

export interface ISafedesktestProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  authLocation: string;
  unAuthLocation: string;
}
