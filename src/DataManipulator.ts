import { ServerRespond } from './DataStreamer';
//Row update to match the schema
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    //Calculate the average price of the top_ ask and the top_bid
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
    const priceEDF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
    //Getting the average price of two securities
    const ratio = priceABC / priceEDF;
    //Setting the upper and lower bound
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    return {
      //Returning the average price, and the ratio
      price_abc: priceABC,
      price_def: priceEDF,
      ratio,
      //Returning the timestamp of the most recent server respond
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
      //returning the upper and lower bound
      upper_bound: upperBound,
      lower_bound: lowerBound,
      //Triggering the alert if ratio is either greater or lower than upper or lower bound.And undefined if none.
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined

    };
    
  }
}
