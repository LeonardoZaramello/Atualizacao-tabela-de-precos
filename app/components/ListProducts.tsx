import { useEffect, useState } from "react";

type productsFromCSV = {
    code: number
    name: string
    cost_price: string
    sales_price: string
    new_price: string
}

export default function ListProducts({products}:any){
    const [productsFromCSV, setProductsFromCSV] = useState<productsFromCSV[]>([])

    useEffect(() => {
        async function getProducts() {
            const response = await fetch("http://localhost:3000/api/csv-reader/products-list-by-ids", {method: "POST", body: JSON.stringify(products)})
            const productsJson = await response.json();
            setProductsFromCSV(productsJson)
        }

        if(products.length > 0){
            getProducts()
        }
    }, [products])

    useEffect(() =>{
        console.log("productsFromCSV", productsFromCSV);
        
    },[productsFromCSV])
    
    return (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-8">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Product ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Product Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Cost Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Sales Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Updated Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <span className="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {productsFromCSV.length > 0 && productsFromCSV.map(product => (
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
                        <td className="px-6 py-4 text-right">
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}