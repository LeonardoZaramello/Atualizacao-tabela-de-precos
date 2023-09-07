"use client"
import Papa from 'papaparse';

const acceptableCSVFileTypes = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv";


export default function Home() {

  // https://github.com/microsoft/TypeScript/issues/31816#issuecomment-646000392
  async function onFileChangeHandler(target: HTMLInputElement) {
    const files = target.files as FileList;
    
    await submitFile(files);

    
  }

  async function postCSVFile(jsonData: any){
    const response = await fetch("http://localhost:3000/api/csv-reader", {method: "POST", body: JSON.stringify(jsonData)})
    console.log(response);
    
  }

  async function submitFile(files: FileList) {

    const jsonCSV = Papa.parse(files[0], {
      skipEmptyLines: true,
      header: true,
      complete: function (result) {
        postCSVFile(result.data)
      }
    });

    console.log("jsonCSV",jsonCSV);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
    </main>
  )
}
