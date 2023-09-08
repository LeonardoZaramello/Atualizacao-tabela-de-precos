import excuteQuery from '@/utils/database';


export async function GET(req: Request, res:Response) {
    try {
        const jsonData = await req.json();

        // const result = await excuteQuery({
        //     query: 'SELECT * FROM products;',
        //     values: [],
        // });

        return new Response(JSON.stringify(req.body));
    } catch ( error ) {
        console.log( error );
    }
};

export async function POST(req: Request, res:Response) {
    try {        
        const jsonData = await req.json();
      

        const result = await excuteQuery({
            query: 'SELECT * FROM products;',
            values: [],
        });

        // console.log(result);
        // console.log(jsonData);
        
        return new Response(JSON.stringify(jsonData));
    } catch ( error ) {
        console.log( error );
    }
};
