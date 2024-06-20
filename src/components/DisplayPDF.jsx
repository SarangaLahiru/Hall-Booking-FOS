import React from 'react';
import { Document, Page } from '@react-pdf/renderer';


function DisplayPDF({ pdfUrl }) {
    return (
        <div>
            <Document file={pdfUrl}>
                <Page pageNumber={1} />
            </Document>
        </div>
    );
}

export default DisplayPDF;
