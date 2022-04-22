import { RecognizerResult, TurnContext } from 'botbuilder';
import { LuisApplication, LuisRecognizer, LuisRecognizerOptionsV3 } from 'botbuilder-ai';

export class LURecognizer {
    private recognizer: LuisRecognizer;

    constructor(config: LuisApplication) {
        const luisIsConfigured = config && config.applicationId && config.endpoint && config.endpointKey;
        if (luisIsConfigured) {
            // Set the recognizer options depending on which endpoint version you want to use e.g LuisRecognizerOptionsV2 or LuisRecognizerOptionsV3.
            // More details can be found in https://docs.microsoft.com/en-gb/azure/cognitive-services/luis/luis-migration-api-v3
            const recognizerOptions: LuisRecognizerOptionsV3 = {
                apiVersion : 'v3'
            };

            this.recognizer = new LuisRecognizer(config, recognizerOptions);
        }
    }

    public get isConfigured(): boolean {
        return (this.recognizer !== undefined);
    }

    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    public async executeLuisQuery(context: TurnContext): Promise<RecognizerResult> {
        return this.recognizer.recognize(context);
    }

    public getBookingSlotEntities(result) {
        let bookingSlot;
        if (result.entities.$instance.BookingSlot) {
            bookingSlot = result.entities.$instance.BookingSlot[0].text;
        }
        return bookingSlot;
    }

    public getDeskCodeEntities(result) {
        let deskCode;
        if (result.entities.$instance.DeskCode) {
            deskCode = result.entities.$instance.DeskCode[0].text;
        }
        return deskCode;
    }

    public getDeskLocationEntities(result) {
        let deskLocation;
        if (result.entities.$instance.DeskLocation) {
            deskLocation = result.entities.$instance.DeskLocation[0].text;
        }
        return deskLocation;
    }

    public getDateTimeEntities(result) {
        const datetimeEntity = result.entities.datetime;
        if (!datetimeEntity || !datetimeEntity[0]) return undefined;

        const timex = datetimeEntity[0].timex;
        if (!timex || !timex[0]) return undefined;

        const datetime = timex[0].split('T')[0];
        return datetime;
    }

}