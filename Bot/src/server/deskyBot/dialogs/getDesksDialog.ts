import { TimexProperty } from '@microsoft/recognizers-text-data-types-timex-expression';
import { CardFactory, InputHints, MessageFactory, TurnContext  } from 'botbuilder';
import {
    ComponentDialog,
    ConfirmPrompt,
    DialogTurnResult,
    OAuthPrompt,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { token } from 'morgan';
import { BookingDetails } from './bookingDetails';
import { DateResolverDialog } from './dateResolverDialog';
import { LogoutDialog } from './logoutDialog';

const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const GETDESKS_DIALOG_ID = "getDesksDialog";
const OAUTH_PROMPT = 'OAuthPrompt';

export class GetDesksDialog extends LogoutDialog {
    constructor() {
        super(GETDESKS_DIALOG_ID, process.env.SSO_CONNECTION_NAME as string);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.bookingSlotStep.bind(this),
                this.deskCodeStep.bind(this),
                this.bookingDateStep.bind(this),
                this.confirmStep.bind(this),
                this.finalStep.bind(this),
                this.authStep.bind(this)
            ]));
            this.addDialog(new OAuthPrompt(OAUTH_PROMPT, {
                connectionName: process.env.connectionName as string,
                text: 'Please sign in to continue',
                timeout: 300000,
                title: 'Sign in please'
            }));
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
    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if (stepContext.result === true) {
            const bookingDetails = stepContext.options as BookingDetails;

            /*
            Connect to API here
            */
            
            await stepContext.context.sendActivity("Here go the desk availability details 👍");

            //return await stepContext.endDialog(bookingDetails);

            return await stepContext.next();
        }
        else {
            await stepContext.context.sendActivity("Ok then let's go through the details step by step...");

            const bookingDetails = new BookingDetails;
            return await stepContext.beginDialog('getDesksDialog', bookingDetails);
        }
        //return await stepContext.endDialog();
    }

    private async authStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {

        await stepContext.context.sendActivity({ attachments: [this.createOAuthCard()] });
        return await stepContext.endDialog();
    }

    private async tokenStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const tokenResponse = stepContext.result;
        if (tokenResponse) {
            await stepContext.context.sendActivity('You are now logged in.');
            console.log(tokenResponse);
            return await stepContext.endDialog();
        }
        await stepContext.context.sendActivity('Login was not successful please try again.');
        return await stepContext.endDialog();  
    }


    private isAmbiguous(timex: string): boolean {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }

    private createOAuthCard() {
        return CardFactory.oauthCard(
            'safedesk', // Replace with the name of your Azure AD connection
            'Sign in to SafeDesk 365',
            'SafeDesk365 OAuth Card'
        );
    }
}