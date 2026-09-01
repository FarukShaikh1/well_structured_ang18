import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  printElement(elementId: string): void {

    const printContent =
      document.getElementById(elementId);

    if (!printContent) {
      console.error(
        `Print element with ID '${elementId}' was not found.`
      );
      return;
    }

    const printWindow = window.open(
      '',
      '_blank',
      'width=1200,height=800'
    );

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>

        <title>Print</title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, Helvetica, sans-serif;
            padding: 10px;
            color: #000;
          }

          h2 {
            text-align: center;
            margin-bottom: 10px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
            vertical-align: top;
          }

          th {
            font-weight: bold;
            text-align: center;
          }

          .print-hide {
            display: none !important;
          }

          @page {
            // size: landscape;
            margin: 0mm;
          }

        </style>

      </head>

      <body>

        ${printContent.innerHTML}

      </body>

      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {

      printWindow.focus();

      printWindow.print();

      printWindow.close();

    }, 500);

  }

}