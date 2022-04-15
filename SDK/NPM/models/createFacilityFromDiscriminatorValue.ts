import {Facility} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createFacilityFromDiscriminatorValue(parseNode: ParseNode | undefined) : Facility {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new Facility();
}
