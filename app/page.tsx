"use client"
import Papa from 'papaparse';
import ListProducts from '@/app/components/ListProducts';
import { useState, useEffect } from 'react';
import testeServerSide from './Services/services';

const acceptableCSVFileTypes = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv";

export default function Home() {
  const [products, setProducts] = useState([])
  const [csvProducts, setCSVProducts] = useState<any>([])
  
  useEffect(() => {
    console.log(csvProducts);

  }, [csvProducts])
  

  // https://github.com/microsoft/TypeScript/issues/31816#issuecomment-646000392
  async function onFileChangeHandler(target: HTMLInputElement) {
    const files = target.files as FileList;
    
    setProducts([])
    submitFile(files[0]);
  }

  function submitFile(file: File) {
    Papa.parse(file, {
      skipEmptyLines: true,
      header: true,
      complete: function (result) {
        setCSVProducts(result.data);
      }
    });
  }

  async function validateForms() {
    const response = await fetch("http://localhost:3000/api/csv-reader", {method: "POST", body: JSON.stringify(csvProducts)})
    const productsJson = await response.json();
    
    setProducts(productsJson);
  }
  const disableValidateButton = () => csvProducts.length == 0;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <label  
        htmlFor="csvFileSelector"
        className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
        <span className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="font-medium text-gray-600">
                Drop files to Attach, or
                <span className="text-blue-600 underline"> browse</span>
            </span>
        </span>
        <input type="file" id="csvFileSelector" accept={acceptableCSVFileTypes} name="file_upload" className="hidden" onChange={(e) => onFileChangeHandler(e.target)}/>
      </label>
       
      <div className="mt-4">
        <span>{csvProducts.length} produtos selecionados </span>
        <button
              type="submit"
              className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              disabled={disableValidateButton()}
              onClick={validateForms}
              >
              Validar
        </button>
      </div>

      <ListProducts products={products} csvProducts={csvProducts} />
    </main>
  )
}
