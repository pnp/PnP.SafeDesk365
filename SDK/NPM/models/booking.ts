import {Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class Booking implements Parsable {
    /** The checkInTime property  */
    private _checkInTime?: Date | undefined;
    /** The checkOutTime property  */
    private _checkOutTime?: Date | undefined;
    /** The date property  */
    private _date?: Date | undefined;
    /** The deskCode property  */
    private _deskCode?: string | undefined;
    /** The id property  */
    private _id?: number | undefined;
    /** The location property  */
    private _location?: string | undefined;
    /** The timeSlot property  */
    private _timeSlot?: string | undefined;
    /** The title property  */
    private _title?: string | undefined;
    /** The user property  */
    private _user?: string | undefined;
    /**
     * Gets the checkInTime property value. The checkInTime property
     * @returns a Date
     */
    public get checkInTime() {
        return this._checkInTime;
    };
    /**
     * Sets the checkInTime property value. The checkInTime property
     * @param value Value to set for the checkInTime property.
     */
    public set checkInTime(value: Date | undefined) {
        this._checkInTime = value;
    };
    /**
     * Gets the checkOutTime property value. The checkOutTime property
     * @returns a Date
     */
    public get checkOutTime() {
        return this._checkOutTime;
    };
    /**
     * Sets the checkOutTime property value. The checkOutTime property
     * @param value Value to set for the checkOutTime property.
     */
    public set checkOutTime(value: Date | undefined) {
        this._checkOutTime = value;
    };
    /**
     * Gets the date property value. The date property
     * @returns a Date
     */
    public get date() {
        return this._date;
    };
    /**
     * Sets the date property value. The date property
     * @param value Value to set for the date property.
     */
    public set date(value: Date | undefined) {
        this._date = value;
    };
    /**
     * Gets the deskCode property value. The deskCode property
     * @returns a string
     */
    public get deskCode() {
        return this._deskCode;
    };
    /**
     * Sets the deskCode property value. The deskCode property
     * @param value Value to set for the deskCode property.
     */
    public set deskCode(value: string | undefined) {
        this._deskCode = value;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "checkInTime": n => { this.checkInTime = n.getDateValue(); },
            "checkOutTime": n => { this.checkOutTime = n.getDateValue(); },
            "date": n => { this.date = n.getDateValue(); },
            "deskCode": n => { this.deskCode = n.getStringValue(); },
            "id": n => { this.id = n.getNumberValue(); },
            "location": n => { this.location = n.getStringValue(); },
            "timeSlot": n => { this.timeSlot = n.getStringValue(); },
            "title": n => { this.title = n.getStringValue(); },
            "user": n => { this.user = n.getStringValue(); },
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
     * Serializes information the current object
     * @param writer Serialization writer to use to serialize this model
     */
    public serialize(writer: SerializationWriter) : void {
        if(!writer) throw new Error("writer cannot be undefined");
        writer.writeDateValue("checkInTime", this.checkInTime);
        writer.writeDateValue("checkOutTime", this.checkOutTime);
        writer.writeDateValue("date", this.date);
        writer.writeStringValue("deskCode", this.deskCode);
        writer.writeNumberValue("id", this.id);
        writer.writeStringValue("location", this.location);
        writer.writeStringValue("timeSlot", this.timeSlot);
        writer.writeStringValue("title", this.title);
        writer.writeStringValue("user", this.user);
    };
    /**
     * Gets the timeSlot property value. The timeSlot property
     * @returns a string
     */
    public get timeSlot() {
        return this._timeSlot;
    };
    /**
     * Sets the timeSlot property value. The timeSlot property
     * @param value Value to set for the timeSlot property.
     */
    public set timeSlot(value: string | undefined) {
        this._timeSlot = value;
    };
    /**
     * Gets the title property value. The title property
     * @returns a string
     */
    public get title() {
        return this._title;
    };
    /**
     * Sets the title property value. The title property
     * @param value Value to set for the title property.
     */
    public set title(value: string | undefined) {
        this._title = value;
    };
    /**
     * Gets the user property value. The user property
     * @returns a string
     */
    public get user() {
        return this._user;
    };
    /**
     * Sets the user property value. The user property
     * @param value Value to set for the user property.
     */
    public set user(value: string | undefined) {
        this._user = value;
    };
}
