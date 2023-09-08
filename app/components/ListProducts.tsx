import { useEffect, useState } from "react";

type productsFromCSV = {
    code: number
    name: string
    cost_price: string
    sales_price: string
    new_price: string
}

type product = {
    product_code: number
    new_price: string
}

type Props = {
    products: productsFromCSV[],
    csvProducts: product[],
};

export default function ListProducts({products, csvProducts}:Props){
    const [productsFromCSV, setProductsFromCSV] = useState<productsFromCSV[]>([])
    const [loadingTable, setLoadingTable] = useState(false);

    useEffect(() => {
        async function getProducts() {
            setLoadingTable(true)
            const response = await fetch("http://localhost:3000/api/csv-reader/products-list-by-ids", {method: "POST", body: JSON.stringify(products)})
            const productsJson = await response.json();
            setProductsFromCSV(productsJson)
            setLoadingTable(false)
        }

        if(products.length > 0){
            getProducts()
        }
    }, [products])

    useEffect(() => {
        setProductsFromCSV([])
    }, [csvProducts])

    async function validateTable() {
        console.log("Atualizar Tabela");
        
        console.log(JSON.stringify(productsFromCSV));
        
        const response = await fetch("http://localhost:3000/api/csv-reader/products-update", {method: "POST", body: JSON.stringify(productsFromCSV)})
        console.log(response);
    }


    let WrongValues = 0;
    function checkValues(salesPrice: number, newPrice: number) {
        if((salesPrice * 1.1) < newPrice) {
            WrongValues += 1;
            return "❌ Valor muito alto";
        }
        if((salesPrice * 0.9) > newPrice) {
            WrongValues += 1;
            return "❌ Valor muito baixo";
        }
        return "✅ Valor válido";
    }

    if(loadingTable) return (<h1 className="mt-8">Carregando Tabela...</h1>)
    const disableUpdateButton = () => WrongValues == 0 && productsFromCSV.length > 0;


    return (
        <>
            {
                csvProducts.length > 0 && products.length == 0 &&
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-8">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                IDa
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nome do Produto
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Preço de custo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Preço de venda
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Preço após atualizar
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Detalhes
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {csvProducts.map(product => (
                            <tr key={product.product_code} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {product.product_code}
                                </th>
                                <td className="px-6 py-4">
                                    À validar
                                </td>
                                <td className="px-6 py-4">
                                    À validar
                                </td>
                                <td className="px-6 py-4">
                                    À validar
                                </td>
                                <td className="px-6 py-4">
                                    {product.new_price}
                                </td>
                                <td className="px-6 py-4 text-left">
                                    Esperando Validação
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            {
                productsFromCSV.length > 0 &&
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-8">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nome do Produto
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Preço de custo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Preço de venda
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Preço após atualizar
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Detalhes
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsFromCSV.map(product => (
                            <tr key={product.code} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {product.code}
                                </th>
                                <td className="px-6 py-4">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4">
                                    {product.cost_price}
                                </td>
                                <td className="px-6 py-4">
                                    {product.sales_price}
                                </td>
                                <td className="px-6 py-4">
                                    {product.new_price}
                                </td>
                                <td className="px-6 py-4 text-left">
                                    {checkValues(parseInt(product.sales_price), parseInt(product.new_price))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            {WrongValues > 0 && <h1 className="text-2xl mt-8">Tabela inválida para envio</h1>}
            
            <button
                type="submit"
                className="mt-8 text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                disabled={!disableUpdateButton()}
                onClick={validateTable}
                >
                Atualizar Tabela
            </button>
        </>
    )
}