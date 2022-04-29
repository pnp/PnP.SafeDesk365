import { SafeDesk365Client } from '../../services/safeDesk365Client/SafeDesk365Client';

export interface ISafeDesk365AceAdaptiveCardExtensionProps {
    title: string;
    safeDesk365ApiUniqueUri: string;
    safeDesk365ApiUri: string;
    safeDesk365ApiId: string;
    safeDesk365: SafeDesk365Client;
    fetchData: () => Promise<void>;
}