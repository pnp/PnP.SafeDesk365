import {Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class Desk implements Parsable {
    /** The code property  */
    private _code?: string | undefined;
    /** The coffeeMachineDistance property  */
    private _coffeeMachineDistance?: number | undefined;
    /** The description property  */
    private _description?: string | undefined;
    /** The facilities property  */
    private _facilities?: string | undefined;
    /** The id property  */
    private _id?: number | undefined;
    /** The location property  */
    private _location?: string | undefined;
    /** The picture property  */
    private _picture?: string | undefined;
    /**
     * Gets the code property value. The code property
     * @returns a string
     */
    public get code() {
        return this._code;
    };
    /**
     * Sets the code property value. The code property
     * @param value Value to set for the code property.
     */
    public set code(value: string | undefined) {
        this._code = value;
    };
    /**
     * Gets the coffeeMachineDistance property value. The coffeeMachineDistance property
     * @returns a integer
     */
    public get coffeeMachineDistance() {
        return this._coffeeMachineDistance;
    };
    /**
     * Sets the coffeeMachineDistance property value. The coffeeMachineDistance property
     * @param value Value to set for the coffeeMachineDistance property.
     */
    public set coffeeMachineDistance(value: number | undefined) {
        this._coffeeMachineDistance = value;
    };
    /**
     * Gets the description property value. The description property
     * @returns a string
     */
    public get description() {
        return this._description;
    };
    /**
     * Sets the description property value. The description property
     * @param value Value to set for the description property.
     */
    public set description(value: string | undefined) {
        this._description = value;
    };
    /**
     * Gets the facilities property value. The facilities property
     * @returns a string
     */
    public get facilities() {
        return this._facilities;
    };
    /**
     * Sets the facilities property value. The facilities property
     * @param value Value to set for the facilities property.
     */
    public set facilities(value: string | undefined) {
        this._facilities = value;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "code": n => { this.code = n.getStringValue(); },
            "coffeeMachineDistance": n => { this.coffeeMachineDistance = n.getNumberValue(); },
            "description": n => { this.description = n.getStringValue(); },
            "facilities": n => { this.facilities = n.getStringValue(); },
            "id": n => { this.id = n.getNumberValue(); },
            "location": n => { this.location = n.getStringValue(); },
            "picture": n => { this.picture = n.getStringValue(); },
        };
    };
    /**
     * Gets the id property value. The id property
     * @returns a integer
     */
    public get id() {
        return this._id;
    };
    /**
     * Sets the id property value. The id property
     * @param value Value to set for the id property.
     */
    public set id(value: number | undefined) {
        this._id = value;
    };
    /**
     * Gets the location property value. The location property
     * @returns a string
     */
    public get location() {
        return this._location;
    };
    /**
     * Sets the location property value. The location property
     * @param value Value to set for the location property.
     */
    public set location(value: string | undefined) {
        this._location = value;
    };
    /**
     * Gets the picture property value. The picture property
     * @returns a string
     */
    public get picture() {
        return this._picture;
    };
    /**
     * Sets the picture property value. The picture property
     * @param value Value to set for the picture property.
     */
    public set picture(value: string | undefined) {
        this._picture = value;
    };
    /**
     * Serializes information the current object
     * @param writer Serialization writer to use to serialize this model
     */
    public serialize(writer: SerializationWriter) : void {
        if(!writer) throw new Error("writer cannot be undefined");
        writer.writeStringValue("code", this.code);
        writer.writeNumberValue("coffeeMachineDistance", this.coffeeMachineDistance);
        writer.writeStringValue("description", this.description);
        writer.writeStringValue("facilities", this.facilities);
        writer.writeNumberValue("id", this.id);
        writer.writeStringValue("location", this.location);
        writer.writeStringValue("picture", this.picture);
    };
}
