//  logic for receipt operations

export const saveToLocalStorage = (receipt) => {
  const history = getHistory();
  const newReceipt = {
    ...receipt,
    id: Date.now(),
    timestamp: new Date().toISOString()
  };
  history.unshift(newReceipt);
  // Keep only last 50 receipts
  if (history.length > 50) {
    history.pop();
  }
  localStorage.setItem('receiptHistory', JSON.stringify(history));
  return newReceipt;
};

export const getHistory = () => {
  const data = localStorage.getItem('receiptHistory');
  return data ? JSON.parse(data) : [];
};

export const deleteFromHistory = (id) => {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem('receiptHistory', JSON.stringify(filtered));
  return filtered;
};

export const clearHistory = () => {
  localStorage.removeItem('receiptHistory');
  return [];
};

export const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0;
    return sum + amount;
  }, 0);
};

export const formatCurrency = (amount, currency = 'USD') => {
  const formatted = parseFloat(amount).toFixed(2);
  return `${formatted} ${currency}`;
};

export const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.recipientName.trim()) {
    errors.recipientName = 'الاسم مطلوب';
  }
  
  if (!formData.amount || parseFloat(formData.amount) <= 0) {
    errors.amount = 'المبلغ مطلوب ويجب أن يكون أكبر من صفر';
  }

  if (!formData.currency.trim()) {
    errors.currency = 'العملة مطلوبة';
  }
  
  if (!formData.receiverName.trim()) {
    errors.receiverName = 'اسم المستلم مطلوب';
  }
  
  const hasValidItem = formData.items.some(
    item => item.description.trim() && parseFloat(item.amount) > 0
  );
  
  if (!hasValidItem) {
    errors.items = 'يجب إضافة بند واحد على الأقل';
  }
  
  return errors;
};

export const getInitialFormData = () => ({
  date: new Date().toISOString().split('T')[0],
  recipientName: '',
  amount: '',
  currency: 'USD',
  amountInWords: '',
  receiverName: '',
  items: [{ description: '', amount: '' }]
});
