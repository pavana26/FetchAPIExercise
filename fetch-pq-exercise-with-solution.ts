const API_BASE_URL = 'https://api.example.com/deviceOnlineStatus'

const API_BEARER_TOKEN = `eyJ0eXAiOiJKadsCJhbGciOiJIy45wNiJ9.eyJpc3MiOiJ5ZWx`

// An authorised GET request to a hypothetical API endpoint
// https://api.example.com/deviceOnlineStatus/{deviceId} returns true or false, indicating whether
// the requested device is online.
//
// E.g. response body .text = 'true' => device is online
//
// You may use the browser fetch API:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

/**
 * Gets the online statuses of th
 * e passed devices
 * @param deviceIds Array of device IDs to check the online status of
 */
let deviceIds = [1,2,3,4,5,6,7,8];
// To hold the device id and corresponsing status value
let deviceStatus:Status[] = [];
export interface Status {
    id:number;
    status:string;
}

/* This section of the code is used to demonstrate how to call function ,wait for correct values and testing purpose */
const st2 = await getDevicesOnlineStatus(deviceIds);
setTimeout(() =>  {
    console.log(deviceStatus);
    console.log(deviceStatus.find((item)=>item.id==4));}, (Math.ceil(deviceIds.length/5)*3000)); 
         
export async function getDevicesOnlineStatus(deviceIds: number[]) {
    // TODO: Implement this function assuming that the example.com/deviceOnlineStatus API endpoint
    // allows a maximum of 5 concurrent requests
    //
    // Assume:
    // - Individual requests take a random amount of time between 1 and 3 seconds to complete
    // - Simultaneous requests will not delay or slow each other
    //
    // Make reasonable assumptions if there are any other factors you believe are relevant
    //
    // Choose a sensible return type that allows the caller to easily look up the online status
    // (true of false) of a device by its ID

    /* Since there are 5 concurrent requests possible ,breaking it into chunk of 5 */
    const chunkSize = 5;
    const chunks:any = [];
    if(deviceIds.length==0){
        return;
    }
    for (let i = 0; i < deviceIds.length; i += chunkSize) {
        const chunk = deviceIds.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    let i = 0;
    const result = 
        chunks.map((chunk:any)=>{
            try{
                /*setTimeout is used to introduce delay between 5 concurrent requests.Here it is assumed one set of 
                concurrent requests will take 3s */
               setTimeout(() => fetchDeviceStatusConcurrentRequest(chunk), i * 3000);
               i= i+1;
            }catch(error){
                    console.error(error);
            }
        })
    return deviceStatus;
    
}
    
/*
This method makes upto 5 concurrent requests to fetch api to get device status.Here it is assumed that response.json()
 gives values like 'true' or 'false'
*/    


export async function fetchDeviceStatusConcurrentRequest(chunk :number[]):Promise<Status[]>{
  const statusdev =  await Promise.allSettled(chunk.map(async(deviceId)=>{
        const response =  await fetch(`${API_BASE_URL}/${deviceId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_BEARER_TOKEN}` // Not always needed with a GET request
            }
        });
        if(!response.ok){
            throw new Error("Could not fetch resource");
        }
        const data = await response.json();
        /* If response is obtained via response.text() we can set values by parsing json as below */
        //  const textData = await response.text();
        //If response is required to be converted to json.
        // const jsonText = JSON.parse(textData);
        var devStatus :Status ={ id:deviceId,status:data.completed ? "online":"offline"}
        deviceStatus.push(devStatus);
      
    }));
    return deviceStatus;
}
