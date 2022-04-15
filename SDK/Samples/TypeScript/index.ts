import { DeviceCodeCredential } from '@azure/identity';
import { AzureIdentityAuthenticationProvider } from '@microsoft/kiota-authentication-azure';
import { AnonymousAuthenticationProvider } from '@microsoft/kiota-abstractions';
import { FetchRequestAdapter } from '@microsoft/kiota-http-fetchlibrary';
import { ApiClient } from 'safedesk-sdk/apiClient';
import { ApiRequestBuilder } from 'safedesk-sdk/api/apiRequestBuilder';




  const authProvider =
  new AnonymousAuthenticationProvider()
  


const adapter = new FetchRequestAdapter(authProvider);
const client = new ApiClient(adapter);

async function GetLocation(): Promise<void> {
    try {
      const me = await client.api.locations.get();
      if(me != undefined)
      {
      console.log(`Hello ${me[0].id}, your ID is ${me[0].name}`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  GetLocation();