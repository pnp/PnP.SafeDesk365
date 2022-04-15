import {DeskAvailability} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createDeskAvailabilityFromDiscriminatorValue(parseNode: ParseNode | undefined) : DeskAvailability {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new DeskAvailability();
}
