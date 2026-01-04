import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  Box,
  Card,
  CardContent,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
  MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  History as HistoryIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import {
  getHistory,
  deleteFromHistory,
  calculateTotal,
  validateForm,
  getInitialFormData
} from '../utils/receiptLogic';
import UseArabicNumber from '../hooks/useArabicNumber';
// Test my custom input component
import Input from './UI/Input';


function ReceiptForm({ onGenerate }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState(getInitialFormData());
  const [history, setHistory] = useState(() => getHistory());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
    if (errors.items) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', amount: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const handleGenerate = () => {
    // Calculate total on submit
    const total = calculateTotal(formData.items);
    const amountInWords = UseArabicNumber(total);
    const dataToSend = { ...formData, amount: total.toFixed(2), amountInWords };
    const validationErrors = validateForm(dataToSend);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackbar({
        open: true,
        message: 'يرجى تصحيح الأخطاء في النموذج',
        severity: 'error'
      });
      return;
    }

    onGenerate(dataToSend);
    setSnackbar({
      open: true,
      message: 'جاري إنشاء الإيصال...',
      severity: 'success'
    });
  };

  const loadFromHistory = (item) => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      recipientName: item.recipientName,
      amount: item.amount,
      currency: item.currency,
      amountInWords: item.amountInWords,
      receiverName: item.receiverName,
      items: item.items
    });
    setDrawerOpen(false);
    setSnackbar({
      open: true,
      message: 'تم تحميل الإيصال',
      severity: 'success'
    });
  };

  const handleDeleteFromHistory = (id) => {
    const updated = deleteFromHistory(id);
    setHistory(updated);
    setSnackbar({
      open: true,
      message: 'تم حذف الإيصال',
      severity: 'info'
    });
  };

  const handleReset = () => {
    setFormData(getInitialFormData());
    setErrors({});
  };

  // Calculate total on render
  const totalAmount = calculateTotal(formData.items).toFixed(2);

  return (
    <Container maxWidth="md" sx={{ py: 4 }} display="overflow: hidden">
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'primary.dark' }}>
            إنشاء إيصال استلام
          </Typography>
          <IconButton
            color="secondary"
            onClick={() => setDrawerOpen(true)}
            sx={{ bgcolor: 'secondary.light',color: 'secondary.dark', '&:hover': { bgcolor: 'secondary.main', color: 'white' } }}
          >
            <HistoryIcon />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          {/* Date */}
          <Input
            xs={6}
            md={6}
            name="date"
            label="التاريخ"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />

          {/* Currency */}
          <Input
            xs={6}
            md={6}
            name="currency"
            label="العملة"
            type="select"
            value={formData.currency}
            onChange={handleInputChange}
            error={!!errors.currency}
            helperText={errors.currency}
            required
            selectOptions={[
              { value: 'USD', label: 'دولار أمريكي' },
              { value: 'EUR', label: 'يورو' },
              { value: 'QAR', label: 'ريال قطري' }
            ]}
          />
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>


          {/* Recipient Name */}
          <Input
            xs={12}
            md={6}
            name="recipientName"
            label="استلمنا من السيد"
            type="text"
            value={formData.recipientName}
            onChange={handleInputChange}
            error={!!errors.recipientName}
            helperText={errors.recipientName}
            required
          />


          {/* Receiver Name */}
          <Input
            xs={12}
            md={6}
            name="receiverName"
            label="اسم المستلم"
            type="text"
            value={formData.receiverName}
            onChange={handleInputChange}
            error={!!errors.receiverName}
            helperText={errors.receiverName}
            required
          />

          {/* Items Section */}
          <Grid size={{ xs: 12 }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>البنود</Typography>
              <Button
                endIcon={<AddIcon />}
                onClick={addItem}
                variant="contained"
                size="small"
                sx={{ minWidth: 120, gap: 2 }}
              >
                إضافة بند
              </Button>
            </Box>

            {errors.items && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.items}
              </Alert>
            )}

            {formData.items.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Grid container spacing={1} alignItems="center">

                  <Input
                    xs={6}
                    md={6}
                    name={`description-${index}`}
                    label={`البيان ${index + 1}`}
                    type="text"
                    size="small"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                  />
                  <Input
                    xs={4}
                    md={4}
                    name={`amount-${index}`}
                    label="المبلغ"
                    type="number"
                    size="small"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                    required
                  />

                  <Grid size={2}>
                    <IconButton
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                المجموع الكلي:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {totalAmount} {formData.currency}
              </Typography>
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
                variant="contained"
                fullWidth={isMobile}
                endIcon={<PrintIcon />}
                onClick={handleGenerate}
                size="large"
                sx={{ gap: 1 }}
              >
                إنشاء وتحميل PDF
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                size="large"
                fullWidth={isMobile}
              >
                إعادة تعيين
              </Button>
              
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* History Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: isMobile ? '80vw' : 350, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              الإيصالات السابقة
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {history.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="لا توجد إيصالات سابقة"
                  sx={{ textAlign: 'center', color: 'text.secondary' }}
                />
              </ListItem>
            ) : (
              history.map((item) => (
                <Box key={item.id}>
                  <ListItem
                    button
                    onClick={() => loadFromHistory(item)}
                    sx={{
                      '&:hover': { bgcolor: 'primary.light' },
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemText
                      primary={item.recipientName}
                      secondary={`${item.amount} ${item.currency} - ${new Date(item.timestamp).toLocaleDateString('ar-EG')}`}
                    />
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFromHistory(item.id);
                      }}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                  <Divider />
                </Box>
              ))
            )}
          </List>
        </Box>
      </Drawer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ReceiptForm;
