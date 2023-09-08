import excuteQuery from '@/utils/database';
import { FieldPacket, OkPacket, OkPacketParams, RowDataPacket } from 'mysql2/promise';

type result = {
    code: number,
    name: string,
    cost_price: string,
    sales_price: string
    new_price: string
}
export async function POST(req: Request, res:Response) {
    try {    
        const products = await req.json();

        const sqlQueryValues = []
        for (let index = 0; index < products.length; index++) {
            sqlQueryValues.push(products[index].product_code);
        }
        
        const result = await excuteQuery({
            query: `SELECT * FROM shopper.products WHERE code IN (${sqlQueryValues.toString()});`,
        })as [RowDataPacket,FieldPacket[], result[]];

        for (let index = 0; index < result.length; index++) {
            const element:result|any = result[index];
            element.new_price= products[index].new_price
        }
        console.log(result);
        
        return new Response(JSON.stringify(result));
        
    } catch ( error ) {
        console.log( error );
    }
};
