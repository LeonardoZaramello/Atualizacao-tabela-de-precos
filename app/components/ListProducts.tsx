import { useEffect, useState } from "react";

// type productsFromCSV = {
//     new_price: string
//     product_code: string
// }

export default function ListProducts(products:any){
    const [productsFromCSV, setProductsFromCSV] = useState([])

    useEffect(() => {
        async function getProducts() {
            const response = await fetch("http://localhost:3000/api/csv-reader/products-list-by-ids", {method: "POST", body: JSON.stringify(products)})
            const productsJson = await response.json();
            setProductsFromCSV(productsJson)
        }

        getProducts()
    }, [products])

    useEffect(() =>{
        console.log("productsFromCSV",productsFromCSV);
        
    },[productsFromCSV])
    
    return (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Apple MacBook Pro 17
                    </th>
                    <td className="px-6 py-4">
                        Silver
                    </td>
                    <td className="px-6 py-4">
                        Laptop
                    </td>
                    <td className="px-6 py-4">
                        $2999
                    </td>
                    <td className="px-6 py-4">
                        $2999
                    </td>
                    <td className="px-6 py-4 text-right">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    </td>
                </tr>
                {}

            </tbody>
        </table>
    )
}