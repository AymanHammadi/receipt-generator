import { useRef, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import ReceiptForm from './components/ReceiptForm';
import ReceiptTemplate from './components/ReceiptTemplate';
import { saveToLocalStorage } from './utils/receiptLogic';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';


const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#009688',
      light: '#52c7b8',
      dark: '#00695f',
    },
    secondary: {
      main: '#f6a5c0',
      light: '#f48fb1',
      dark: '#87103f',
    },
  },
  typography: {
    fontFamily: "'Baloo Bhaijaan 2', cursive",
  },
});

function App() {
  const receiptRef = useRef();
  const [currentData, setCurrentData] = useState(null);

  const generatePDF = async (formData) => {
    try {
      // Save to history
      saveToLocalStorage(formData);
      
      // Update current data for the hidden template
      setCurrentData(formData);

      // Wait for state update and render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Wait for fonts to load
      await document.fonts.ready;

      // Generate canvas with high quality settings for Arabic text
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        windowWidth: 794,
      });

      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Calculate dimensions to fit A4
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297; // A4 height in mm

      // Add image to PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      if (imgHeight <= pageHeight) {
        // Single page
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      } else {
        // Multiple pages
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
          heightLeft -= pageHeight;
        }
      }

      // Generate filename
      const date = new Date().toISOString().split('T')[0];
      const safeName = formData.recipientName.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '-');
      const filename = `receipt-${safeName}-${date}.pdf`;

      // Save PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box dir="rtl" sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <ReceiptForm onGenerate={generatePDF} />
        
        {/* Hidden receipt template for PDF generation */}
        <Box sx={{ position: 'absolute', left: '-9999px', top: 0, width: '794px' }}>
          {currentData && <ReceiptTemplate ref={receiptRef} data={currentData} />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
