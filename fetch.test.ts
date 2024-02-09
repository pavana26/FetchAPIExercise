import { ok } from "assert/strict";
import {fetchDeviceStatusConcurrentRequest} from "../fetch-pq-exercise-with-instructions";

global.fetch = jest.fn(()=>
Promise.resolve({
    response: ok, 
    status: 200,
    json: ()=>Promise.resolve("true")
})
) as jest.Mock;
test('Device status read correctly',async ()=>{
    const deviceIds = [2,3,5];
    const value = await fetchDeviceStatusConcurrentRequest(deviceIds);
     expect(fetch).toHaveBeenCalledTimes(3);
})



