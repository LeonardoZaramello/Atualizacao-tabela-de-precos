import Papa from 'papaparse';

export default function testeServerSide(file: File) {
    Papa.parse(file, {
      skipEmptyLines: true,
      header: true,
      complete: function (result) {
        console.log(result.data);
      }
    });
  }