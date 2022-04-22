import {
    ComponentDialog,
    DialogSet,
    DialogState,
    DialogTurnResult,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from "botbuilder-dialogs";
import {
    MessageFactory,
    StatePropertyAccessor,
    InputHints,
    TurnContext,
    RecognizerResult
} from "botbuilder";
import { TeamsInfoDialog } from "./teamsInfoDialog";
import { HelpDialog } from "./helpDialog";
import { MentionUserDialog } from "./mentionUserDialog";
//Custom imports
import { LuisRecognizer } from 'botbuilder-ai';
import { LURecognizer } from './luRecognizer';
import { BookingDialog } from './bookingDialog';
import { BookingDetails } from './bookingDetails';

const MAIN_DIALOG_ID = "mainDialog";
const MAIN_WATERFALL_DIALOG_ID = "mainWaterfallDialog";

export class MainDialog extends ComponentDialog {
    private luisRecognizer: LURecognizer;
    public onboarding: boolean;
    constructor(luisRecognizer: LURecognizer) {
        super(MAIN_DIALOG_ID);

        if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        this.luisRecognizer = luisRecognizer;

        this.addDialog(new TextPrompt("TextPrompt"))
            .addDialog(new TeamsInfoDialog())
            .addDialog(new HelpDialog())
            .addDialog(new MentionUserDialog())
            .addDialog(new BookingDialog())
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG_ID, [
                this.introStep.bind(this),
                this.actStep.bind(this),
                this.finalStep.bind(this)
            ]));
        this.initialDialogId = MAIN_WATERFALL_DIALOG_ID;
        this.onboarding = false;
    }

    public async run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(context);
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

    private async actStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if (stepContext.result) {
            /*
            ** This is where you would add LUIS to your bot, see this link for more information:
            ** https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-luis?view=azure-bot-service-4.0&tabs=javascript
            */

            const bookingDetails = new BookingDetails();
            const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
            const intent = LuisRecognizer.topIntent(luisResult)
            //await stepContext.context.sendActivity(intent);
            //console.log(luisResult);

            const entities = luisResult.entities;
            console.log(entities.$instance.BookingSlot);
            //await stepContext.context.sendActivity(entities.$instance.DeskCode);
            switch(intent){
                case "BookDesk":{
                    // Open BookingDialog
                    console.log("Intent is Bookdesk");
                    const bookingSlot = this.luisRecognizer.getBookingSlotEntities(luisResult);
                    console.log(bookingSlot);
                    const dateTimeEntities = this.luisRecognizer.getDateTimeEntities(luisResult);
                    console.log(dateTimeEntities);
                    const deskCodeEntities = this.luisRecognizer.getDeskCodeEntities(luisResult);
                    console.log(deskCodeEntities);
                    const deskLocationEntities = this.luisRecognizer.getDeskLocationEntities(luisResult);
                    console.log(deskLocationEntities);
                    bookingDetails.bookingSlot = bookingSlot;
                    bookingDetails.dateTime = dateTimeEntities;
                    bookingDetails.deskCode = deskCodeEntities;
                    bookingDetails.deskLocation = deskLocationEntities;
                    return await stepContext.beginDialog('bookingDialog', bookingDetails);
                }
                case "GetAvailableDesk":{
                    // Open GetAvailableDeskDialog
                }
                default: {
                    await stepContext.context.sendActivity("Ok, maybe next time 😉");
                    return await stepContext.next();
                }  
            }

            /*
            const result = stepContext.result.trim().toLocaleLowerCase();
            switch (result) {
                case "who" :
                case "who am i?": {
                    return await stepContext.beginDialog("teamsInfoDialog");
                }
                case "get help":
                case "help": {
                    return await stepContext.beginDialog("helpDialog");
                }
                case "mention me":
                case "mention": {
                    return await stepContext.beginDialog("mentionUserDialog");
                }
                default: {
                    await stepContext.context.sendActivity("Ok, maybe next time 😉");
                    return await stepContext.next();
                }
            }
            */
        } else if (this.onboarding) {
            switch (stepContext.context.activity.text) {
                case "who": {
                    return await stepContext.beginDialog("teamsInfoDialog");
                }
                case "help": {
                    return await stepContext.beginDialog("helpDialog");
                }
                case "mention": {
                    return await stepContext.beginDialog("mentionUserDialog");
                }
                default: {
                    await stepContext.context.sendActivity("Ok, maybe next time 😉");
                    return await stepContext.next();
                }
            }
        }
        return await stepContext.next();
    }

    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: "What else can I do for you?" });
    }
}
