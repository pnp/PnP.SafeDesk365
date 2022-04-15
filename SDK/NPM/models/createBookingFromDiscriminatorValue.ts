import {Booking} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createBookingFromDiscriminatorValue(parseNode: ParseNode | undefined) : Booking {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new Booking();
}
