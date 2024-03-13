import axios from 'axios';
import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function Pdf() {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [opinions, setOpinions] = useState([]);



  useEffect(() => {
    function fetchingOpinions() {
      axios.get(`${API_URL}/api/opinions`)
        .then(gettingOpinions => {
          setOpinions(gettingOpinions.data);
        })
        .catch(e => console.log("error fetching the opinions"));
    };

    fetchingOpinions();
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  if(opinions.length === null) {
      return <p>Loading...</p>
  } else {
    return (
      <div className='pdf-div'>
        <Document file={opinions.mediaUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map(page => {
            return(
              <Page 
                pageNumber={page} 
                renderTextLayer={false} 
                renderAnnotationLayer={false}     
              />
            )
          })
        }
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    );
    
  }
};

export default Pdf;