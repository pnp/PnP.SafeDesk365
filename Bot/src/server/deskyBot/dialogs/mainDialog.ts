import {
    InputHints,
    MessageFactory,
    StatePropertyAccessor,
    TurnContext
} from "botbuilder-core";
import {
    DialogSet,
    DialogState,
    DialogTurnResult,
    DialogTurnStatus,
    WaterfallDialog,
    WaterfallStepContext
} from "botbuilder-dialogs";
import { LuisRecognizer } from 'botbuilder-ai';
import { LogoutDialog } from "./logoutDialog";
import { SsoOauthPrompt } from "./ssoOauthPrompt";
import "isomorphic-fetch";
import { LURecognizer } from './luRecognizer';
import { BookingDialog } from './bookingDialog';
import { HelpDialog } from './helpDialog';
import { GetDesksDialog } from './getDesksDialog';
import { BookingDetails } from './bookingDetails';
const MAIN_DIALOG_ID = "MainDialog";
const MAIN_WATERFALL_DIALOG_ID = "MainWaterfallDialog";
const OAUTH_PROMPT_ID = "OAuthPrompt";
export class MainDialog extends LogoutDialog {
    private luisRecognizer: LURecognizer;
    public onboarding: boolean;
    constructor(luisRecognizer: LURecognizer) {
        super(MAIN_DIALOG_ID, process.env.SSO_CONNECTION_NAME as string);
        if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        this.luisRecognizer = luisRecognizer;
        // sso signin prompt
        this.addDialog(new SsoOauthPrompt(OAUTH_PROMPT_ID, {
            connectionName: process.env.SSO_CONNECTION_NAME as string,
            text: "Please sign in",
            title: "Sign In",
            timeout: 300000
        }));

        this.addDialog(new BookingDialog());
        this.addDialog(new GetDesksDialog());
        this.addDialog(new HelpDialog());

        // add waterfall dialogs
        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG_ID, [
            this.introStep.bind(this),
            //this.promptStep.bind(this),
            //his.displayMicrosoftGraphDataStep.bind(this)
            this.luisStep.bind(this)
        ]));

        // set the initial dialog to the waterfall
        this.initialDialogId = MAIN_WATERFALL_DIALOG_ID;
        this.onboarding = false;
    }

    public async run(turnContext: TurnContext, accessor: StatePropertyAccessor<DialogState>): Promise<void> {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog(this.id);
        }
    }

    private async introStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if ((stepContext.options as any).restartMsg) {
            const messageText = (stepContext.options as any).restartMsg ? (stepContext.options as any).restartMsg : "What can I help you with today?";
            const promptMessage = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt("TextPrompt", { prompt: promptMessage });
        } else {
            this.onboarding = true;
            return await stepContext.next();
        }
    }

    public async luisStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        const intent = LuisRecognizer.topIntent(luisResult)
        // Get the text values for all needed entities
        const bookingSlot = this.luisRecognizer.getBookingSlotEntities(luisResult);
        const dateTimeEntities = this.luisRecognizer.getDateTimeEntities(luisResult);
        const deskCodeEntities = this.luisRecognizer.getDeskCodeEntities(luisResult);
        const deskLocationEntities = this.luisRecognizer.getDeskLocationEntities(luisResult);
        // Populate the bookingDetails
        const bookingDetails = new BookingDetails();
        bookingDetails.bookingSlot = bookingSlot;
        bookingDetails.dateTime = dateTimeEntities;
        bookingDetails.deskCode = deskCodeEntities;
        bookingDetails.deskLocation = deskLocationEntities;
        switch(intent){
            case "BookDesk":{
                // Open BookingDialog
                console.log("Intent is Bookdesk");
                return await stepContext.beginDialog('bookingDialog', bookingDetails);
            }
            case "GetAvailableDesk":{
                // Open GetAvailableDeskDialog
                console.log("Intent is GetAvailableDesk");
                return await stepContext.beginDialog('getDesksDialog', bookingDetails);
            }
            case "Help":{
                // Open GetAvailableDeskDialog
                console.log("Intent is Help");
                return await stepContext.beginDialog('helpDialog', bookingDetails);
            }
            default: {
                await stepContext.context.sendActivity("Ok, maybe next time 😉");
                return await stepContext.endDialog();
            }  
        }
    }
}