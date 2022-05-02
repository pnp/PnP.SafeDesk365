import { TimexProperty } from '@microsoft/recognizers-text-data-types-timex-expression';
import { InputHints, MessageFactory, tokenResponseEventName } from 'botbuilder';
import {
    ComponentDialog,
    ConfirmPrompt,
    DialogTurnResult,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { BookingDetails } from './bookingDetails';
import { DateResolverDialog } from './dateResolverDialog';
import { LogoutDialog } from "./logoutDialog";
import { SsoOauthPrompt } from "./ssoOauthPrompt";
import "isomorphic-fetch";
import { SafeDesk365, Location, DeskAvailability, Booking } from "../helpers/safeDesk365";

const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const BOOKING_DIALOG_ID = "bookingDialog";
const OAUTH_PROMPT_ID = "OAuthPrompt";

export class BookingDialog extends LogoutDialog  {
    constructor() {
        super(BOOKING_DIALOG_ID, process.env.SSO_CONNECTION_NAME as string);

        // sso signin prompt
        this.addDialog(new SsoOauthPrompt(OAUTH_PROMPT_ID, {
            connectionName: process.env.SSO_CONNECTION_NAME as string,
            text: "Please sign in",
            title: "Sign In",
            timeout: 300000
        }));
        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.bookingSlotStep.bind(this),
                this.deskCodeStep.bind(this),
                this.bookingDateStep.bind(this),
                this.confirmStep.bind(this),
                this.choiceStep.bind(this),
                this.promptStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    private async bookingSlotStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const bookingDetails = stepContext.options as BookingDetails;

        if (!bookingDetails.bookingSlot) {
            const messageText = 'What booking slot do you want to book?';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        } else {
            return await stepContext.next(bookingDetails.bookingSlot);
        }
;
    }

    /**
     * If an origin city has not been provided, prompt for one.
     */
    private async deskCodeStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const bookingDetails = stepContext.options as BookingDetails;

        // Capture the response to the previous step's prompt
        bookingDetails.bookingSlot = stepContext.result;
        if (!bookingDetails.deskCode) {
            const messageText = 'What is your preferred desk code?';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        } else {
            return await stepContext.next(bookingDetails.deskCode);
        }
    }

    /**
     * If a travel date has not been provided, prompt for one.
     * This will use the DATE_RESOLVER_DIALOG.
     */
    private async bookingDateStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const bookingDetails = stepContext.options as BookingDetails;

        // Capture the results of the previous step
        bookingDetails.deskCode = stepContext.result;
        if (!bookingDetails.dateTime || this.isAmbiguous(bookingDetails.dateTime)) {
            return await stepContext.beginDialog(DATE_RESOLVER_DIALOG, { date: bookingDetails.dateTime });
        } else {
            return await stepContext.next(bookingDetails.dateTime);
        }
    }

    /**
     * Confirm the information the user has provided.
     */
    private async confirmStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const bookingDetails = stepContext.options as BookingDetails;
        // Capture the results of the previous step
        bookingDetails.dateTime = stepContext.result;
        const messageText = `Please confirm your booking. <br/> Booking slot: ${ bookingDetails.bookingSlot } <br/> Desk code: ${ bookingDetails.deskCode } <br/> Date: ${ bookingDetails.dateTime }. <br/> Is this correct?`;
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }
    

    /**
     * Complete the interaction and end the dialog.
     */
    private async choiceStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        console.log(stepContext.result);
        if (stepContext.result === true) {
            return await stepContext.next();
        }
        else {
            await stepContext.context.sendActivity("Ok then let's go through the details step by step...");
            const bookingDetails = new BookingDetails;
            return await stepContext.beginDialog('bookingDialog', bookingDetails);
        }
    }

    public async promptStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        try {
          return await stepContext.beginDialog(OAUTH_PROMPT_ID);
        } catch (err) {
          console.error(err);
        }
        return await stepContext.endDialog();
    }

    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        // get token from prev step (or directly from the prompt itself)
        const tokenResponse = stepContext.result;
        //await stepContext.context.sendActivity(tokenResponse.token);
        const bookingDetails = stepContext.options as BookingDetails;
        console.log(bookingDetails.deskLocation);
        // connect to API

        var c = new SafeDesk365("https://safedesk365-pro.azurewebsites.net/", tokenResponse.token);
        var desks = c.GetUpcomingdeskAvailabilities();
        console.log(desks);
        var availability = c.GetUpcomingdeskAvailabilities(bookingDetails.dateTime, bookingDetails.deskLocation);
        console.log(availability);
        
        return await stepContext.endDialog(bookingDetails);
    }


    private isAmbiguous(timex: string): boolean {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}