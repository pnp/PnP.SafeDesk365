import {Desk} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createDeskFromDiscriminatorValue(parseNode: ParseNode | undefined) : Desk {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new Desk();
}
