import { BotDeclaration, PreventIframe } from "express-msteams-host";
import * as debug from "debug";
import { CardFactory, ConversationState, MemoryStorage, UserState, TurnContext } from "botbuilder";
import { DialogBot } from "./dialogBot";
import { MainDialog } from "./dialogs/mainDialog";
import WelcomeCard from "./cards/welcomeCard";
import { LuisApplication } from 'botbuilder-ai';
// The helper-class recognizer that calls LUIS
import { LURecognizer } from './dialogs/luRecognizer';
// Initialize debug logging module
const log = debug("msteams");

/**
 * Implementation for Desky Bot
 */
  @BotDeclaration(
      "/api/messages",
      new MemoryStorage(),
      // eslint-disable-next-line no-undef
      process.env.MICROSOFT_APP_ID,
      // eslint-disable-next-line no-undef
      process.env.MICROSOFT_APP_PASSWORD)
@PreventIframe("/deskyBot/aboutDeskyBot.html")
export class DeskyBot extends DialogBot {
    constructor(conversationState: ConversationState, userState: UserState) {

        // If configured, pass in the LURecognizer. (Defining it externally allows it to be mocked for tests)
        let luisRecognizer;
        const LuisAppId = process.env.LuisAppId ?? "";
        const LuisAPIKey = process.env.LuisAPIKey ?? "";
        const LuisAPIHostName = process.env.LuisAPIHostName ?? "";
        const luisConfig: LuisApplication = { applicationId: LuisAppId, endpointKey: LuisAPIKey, endpoint: `https://${ LuisAPIHostName }` };
        luisRecognizer = new LURecognizer(luisConfig);

        super(conversationState, userState, new MainDialog(luisRecognizer));

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            if (membersAdded && membersAdded.length > 0) {
                for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                    if (membersAdded[cnt].id !== context.activity.recipient.id) {
                        await this.sendWelcomeCard( context );
                    }
                }
            }
            await next();
        });
    }

    public async sendWelcomeCard( context: TurnContext ): Promise<void> {
        const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
        await context.sendActivity({ attachments: [welcomeCard] });
    }

}
