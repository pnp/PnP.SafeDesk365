import { SafeDesk365Client } from '../../../services/safeDesk365Client/SafeDesk365Client';

export interface ISafeDesk365Props {
  hasTeamsContext: boolean;
  safeDesk365Client: SafeDesk365Client;
}
