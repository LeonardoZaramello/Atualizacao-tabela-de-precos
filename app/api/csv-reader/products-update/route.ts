import executeQuery from '@/utils/database';
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

        const sqlProductsPriceUpdates = []
        const sqlProductsPriceUpdatesIDs = []

        const sqlPacksPriceUpdates = []

        for (let index = 0; index < products.length; index++) {

            if(products[index].code < 1000){
                sqlProductsPriceUpdatesIDs.push(`${products[index].code}`)
                sqlProductsPriceUpdates.push(`WHEN code = ${products[index].code} THEN ${products[index].new_price}`)
            }
            else{

                // sqlPacksPriceUpdates.push({
                //     start:"START TRANSACTION;",
                //     updateProduct:`SET @novo_preco_pacote_${[index]} = ${products[index].new_price};`,
                //     calcNewPrice:`UPDATE products
                //                     SET sales_price = @novo_preco_pacote_${[index]}
                //                     WHERE code = ${products[index].code};`,
                //     updateProductsPrice:`SET @quantidade_total_componentes_${[index]} = 0;
                //                             SELECT SUM(qty) INTO @quantidade_total_componentes_${[index]} FROM packs WHERE pack_id = ${products[index].code};`,
                //     updateProductsPrice2:`UPDATE products
                //                             SET sales_price = @novo_preco_pacote_${[index]} / @quantidade_total_componentes_${[index]}
                //                             WHERE code IN (SELECT product_id FROM packs WHERE pack_id = ${products[index].code});`,
                //     commit: "COMMIT;"
                // })
                
                sqlPacksPriceUpdates.push(
                        `
                        START TRANSACTION;

                        SET @novo_preco_pacote_${index} = ${products[index].new_price};

                        UPDATE products
                        SET sales_price = @novo_preco_pacote_${index}
                        WHERE code = ${products[index].code};

                        SET @quantidade_total_componentes_${index} = 0;

                        SELECT SUM(qty) INTO @quantidade_total_componentes_${index} FROM packs WHERE pack_id = ${products[index].code};

                        UPDATE products
                        SET sales_price = @novo_preco_pacote_${index} / @quantidade_total_componentes_${index}
                        WHERE code IN (SELECT product_id FROM packs WHERE pack_id = ${products[index].code});

                        COMMIT;
                        `
                    )

            }

        }
        

        if(sqlPacksPriceUpdates.length > 0){

            console.log("PACKS");
            console.log(sqlPacksPriceUpdates[0]);

            sqlPacksPriceUpdates.forEach(async (packUpdate) =>{
                await executeQuery({
                    query: packUpdate,
                })as [RowDataPacket,FieldPacket[], result[]];
            })
            // const result2 = await executeQuery({
            //     query: sqlPacksPriceUpdates[0],
            // })as [RowDataPacket,FieldPacket[], result[]];

            // const result3 = await excuteQuery({
            //     query:`${sqlPacksPriceUpdates.map(element => element.updateProductsPrice2).join("")}`,
            // })as [RowDataPacket,FieldPacket[], result[]];


            // console.log("ENTROU",result2);
            
        }else if (sqlProductsPriceUpdates.length > 0){

            console.log("PRODUTOS");
            
            const updatedProducts = await executeQuery({
                query: `
                UPDATE products
                SET sales_price = CASE
                    ${sqlProductsPriceUpdates.join(" ")}
                    ELSE sales_price
                END
                WHERE code IN (${sqlProductsPriceUpdatesIDs.join(", ")});
                `,
            })as [RowDataPacket,FieldPacket[], result[]];
    
            const updatedPacks = await executeQuery({
                query: `
                UPDATE products AS pack
                JOIN (
                    SELECT p.pack_id, SUM(p.qty * p2.sales_price) AS new_pack_price
                    FROM packs AS p
                    JOIN products AS p2 ON p.product_id = p2.code
                    WHERE p.pack_id IN (
                        SELECT DISTINCT pack_id
                        FROM packs
                        WHERE product_id IN (${sqlProductsPriceUpdatesIDs.join(", ")})
                    )
                    GROUP BY p.pack_id
                ) AS new_prices
                ON pack.code = new_prices.pack_id
                SET pack.sales_price = new_prices.new_pack_price;
                `,
            })as [RowDataPacket,FieldPacket[], result[]];

        }



        return new Response(JSON.stringify("PricesUpdated"));
        
    } catch ( error ) {
        console.log( error );
    }
};
