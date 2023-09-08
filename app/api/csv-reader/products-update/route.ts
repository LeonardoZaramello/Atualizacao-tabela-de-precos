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
        
        const sqlQueryIds = []
        const sqlPriceUpdates = []

        for (let index = 0; index < products.length; index++) {
            sqlQueryIds.push(products[index].code);
            sqlPriceUpdates.push(`WHEN code = ${products[index].code} THEN ${products[index].new_price}`)
        }

        
        // console.log("SQLUPDATE",`UPDATE products
        //                 SET sales_price = CASE
        //                     ${sqlPriceUpdates.join(" ")}
        //                     ELSE sales_price
        //                 END
        //                 WHERE code IN (${sqlQueryIds.toString()});`);
        
        
        const result = await excuteQuery({
            query: `UPDATE products
                        SET sales_price = CASE
                            ${sqlPriceUpdates.join(" ")}
                            ELSE sales_price
                        END
                        WHERE code IN (${sqlQueryIds.toString()});`,
        })as [RowDataPacket,FieldPacket[], result[]];

        
        return new Response(JSON.stringify(result));
        
    } catch ( error ) {
        console.log( error );
    }
};
