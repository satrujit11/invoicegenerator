import { useState } from 'react';
import { Plus, Trash2, Printer, CreditCard, Mail, MapPin } from 'lucide-react';

// --- Types & Interfaces ---

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

interface ContactInfo {
  name: string;
  email: string;
  address: string;
  phone?: string;
}

interface PaymentInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode: string;
  codeType: string;
  upiId: string;
  notes: string;
}

interface InvoiceState {
  number: string;
  date: string;
  dueDate: string;
  currencySymbol: string;
  sender: ContactInfo;
  client: ContactInfo;
  items: InvoiceItem[];
  paymentInfo: PaymentInfo;
  taxRate: number;
}

interface Currency {
  code: string;
  symbol: string;
  label: string;
}

// --- Component ---

function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<InvoiceState>({
    number: 'INV-2024-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currencySymbol: '$',
    sender: {
      name: 'John Doe (Freelancer)',
      email: 'john@example.com',
      address: '123 Developer Lane, Code City, 90210',
      phone: '+1 (555) 000-0000'
    },
    client: {
      name: 'Client Company LLC',
      email: 'accounts@client.com',
      address: '456 Business Rd, Enterprise City, NY'
    },
    items: [
      { id: 1, description: 'Frontend Development - React Components', quantity: 20, rate: 85.00 },
      { id: 2, description: 'API Integration & Testing', quantity: 10, rate: 85.00 },
      { id: 3, description: 'Server Setup & Deployment', quantity: 5, rate: 90.00 },
    ],
    paymentInfo: {
      bankName: 'Tech Bank International',
      accountName: 'John Doe',
      accountNumber: '1234567890',
      swiftCode: 'TECH0001234',
      codeType: 'IFSC',
      upiId: 'john.doe@upi',
      notes: 'Please include the invoice number in the transfer description. Paypal accepted at: john@example.com'
    },
    taxRate: 0,
  });

  const currencies: Currency[] = [
    { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
    { code: 'EUR', symbol: '€', label: 'Euro (€)' },
    { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
    { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
    { code: 'JPY', symbol: '¥', label: 'Japanese Yen (¥)' },
    { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar (CA$)' },
    { code: 'AUD', symbol: 'AU$', label: 'Australian Dollar (AU$)' },
    { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar (S$)' },
    { code: 'CNY', symbol: 'CN¥', label: 'Chinese Yuan (CN¥)' },
  ];

  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const taxAmount = subtotal * (invoice.taxRate / 100);
  const total = subtotal + taxAmount;

  // Handlers

  // Update nested objects (sender, client, paymentInfo)
  const handleInputChange = (
    section: keyof Pick<InvoiceState, 'sender' | 'client' | 'paymentInfo'>,
    field: string,
    value: string
  ) => {
    setInvoice(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Update root level fields (number, date, etc.)
  const handleRootChange = (field: keyof InvoiceState, value: string | number) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  // Update specific item fields
  const handleItemChange = (id: number, field: keyof InvoiceItem, value: string | number) => {
    // @ts-ignore
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          if (field === 'description') {
            return { ...item, [field]: value };
          } else {
            return { ...item, [field]: Number(value) || 0 };
          }
        }
        return item;
      })
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      description: 'New Service Item',
      quantity: 1,
      rate: 0
    };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const deleteItem = (id: number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans print:bg-white print:p-0">

      {/* Controls - Hidden when printing */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invoice Generator</h1>
          <p className="text-sm text-gray-500">Edit directly on the paper below</p>
        </div>
        <div className="flex gap-4">
          <select
            value={invoice.currencySymbol}
            onChange={(e) => handleRootChange('currencySymbol', e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.symbol}>
                {c.label}
              </option>
            ))}
          </select>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
          >
            <Printer size={18} />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Invoice Paper */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-sm print:shadow-none print:w-full print:max-w-none">

        {/* Main Content Area - Added print:p-10 for margins */}
        <div className="p-8 md:p-12 print:p-10">

          {/* Header Section - Compacted print margin */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 print:mb-6 border-b border-gray-200 pb-8 print:pb-4">
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight uppercase mb-6 print:mb-2">Invoice</h2>

              {/* Sender Info Inputs */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={invoice.sender.name}
                  onChange={(e) => handleInputChange('sender', 'name', e.target.value)}
                  className="block w-full text-lg font-bold text-gray-800 placeholder-gray-300 border-none focus:ring-0 p-0 hover:bg-gray-50 transition-colors"
                  placeholder="Your Name / Company"
                />
                <div className="flex items-center text-gray-600">
                  <Mail size={14} className="mr-2" />
                  <input
                    type="text"
                    value={invoice.sender.email}
                    onChange={(e) => handleInputChange('sender', 'email', e.target.value)}
                    className="w-full text-sm border-none focus:ring-0 p-0 hover:bg-gray-50"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={14} className="mr-2" />
                  <input
                    type="text"
                    value={invoice.sender.address}
                    onChange={(e) => handleInputChange('sender', 'address', e.target.value)}
                    className="w-full text-sm border-none focus:ring-0 p-0 hover:bg-gray-50"
                    placeholder="Your Address"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Meta Data */}
            <div className="w-full md:w-1/3 mt-6 md:mt-0 text-right">
              <div className="flex justify-between md:justify-end items-center mb-2">
                <span className="text-gray-500 font-medium mr-4">Invoice #:</span>
                <input
                  type="text"
                  value={invoice.number}
                  onChange={(e) => handleRootChange('number', e.target.value)}
                  className="text-right font-mono font-bold text-gray-800 border-b border-gray-200 focus:border-blue-500 focus:outline-none w-32 bg-transparent"
                />
              </div>
              <div className="flex justify-between md:justify-end items-center mb-2">
                <span className="text-gray-500 font-medium mr-4">Date:</span>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => handleRootChange('date', e.target.value)}
                  className="text-right text-gray-800 border-b border-gray-200 focus:border-blue-500 focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex justify-between md:justify-end items-center">
                <span className="text-gray-500 font-medium mr-4">Due Date:</span>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => handleRootChange('dueDate', e.target.value)}
                  className="text-right text-gray-800 border-b border-gray-200 focus:border-blue-500 focus:outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Client Section - Compacted print margin */}
          <div className="mb-12 print:mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 print:mb-1">Bill To</h3>
            <div className="space-y-1">
              <input
                type="text"
                value={invoice.client.name}
                onChange={(e) => handleInputChange('client', 'name', e.target.value)}
                className="block w-full text-xl font-bold text-gray-800 placeholder-gray-300 border-none focus:ring-0 p-0 hover:bg-gray-50 transition-colors"
                placeholder="Client Name / Company"
              />
              <input
                type="email"
                value={invoice.client.email}
                onChange={(e) => handleInputChange('client', 'email', e.target.value)}
                className="block w-full text-sm text-gray-600 placeholder-gray-300 border-none focus:ring-0 p-0 hover:bg-gray-50"
                placeholder="client@email.com"
              />
              <input
                type="text"
                value={invoice.client.address}
                onChange={(e) => handleInputChange('client', 'address', e.target.value)}
                className="block w-full text-sm text-gray-600 placeholder-gray-300 border-none focus:ring-0 p-0 hover:bg-gray-50"
                placeholder="Client Address"
              />
            </div>
          </div>

          {/* Items Table - Compacted print margin */}
          <div className="mb-8 print:mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="text-left py-3 text-sm font-bold text-gray-800 uppercase tracking-wider w-1/2">Description</th>
                  <th className="text-right py-3 text-sm font-bold text-gray-800 uppercase tracking-wider w-24">Qty/Hrs</th>
                  <th className="text-right py-3 text-sm font-bold text-gray-800 uppercase tracking-wider w-32">Rate</th>
                  <th className="text-right py-3 text-sm font-bold text-gray-800 uppercase tracking-wider w-32">Amount</th>
                  <th className="print:hidden w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 print:py-2 align-top">
                      <textarea
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-700 resize-none overflow-hidden"
                        rows={1}
                        placeholder="Description of service..."
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                      />
                    </td>
                    <td className="py-4 print:py-2 align-top text-right">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        className="w-full text-right bg-transparent border-none focus:ring-0 p-0 text-gray-700"
                        min="0"
                      />
                    </td>
                    <td className="py-4 print:py-2 align-top text-right">
                      <div className="flex justify-end items-center">
                        <span className="text-gray-400 mr-1">{invoice.currencySymbol}</span>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                          className="w-20 text-right bg-transparent border-none focus:ring-0 p-0 text-gray-700"
                          min="0"
                        />
                      </div>
                    </td>
                    <td className="py-4 print:py-2 align-top text-right font-medium text-gray-800">
                      {invoice.currencySymbol}{(item.quantity * item.rate).toFixed(2)}
                    </td>
                    <td className="py-4 print:py-2 align-top text-center print:hidden">
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={addItem}
              className="mt-4 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 print:hidden"
            >
              <Plus size={16} className="mr-1" /> Add Line Item
            </button>
          </div>

          {/* Totals Section - Compacted print margin */}
          <div className="flex justify-end mb-12 print:mb-6 print:break-inside-avoid">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="flex justify-between py-2 border-b border-gray-100 text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{invoice.currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 text-gray-600 items-center">
                <div className="flex items-center">
                  <span>Tax</span>
                  <div className="flex items-center ml-2 bg-gray-100 rounded px-2 print:bg-transparent">
                    <input
                      type="number"
                      value={invoice.taxRate}
                      onChange={(e) => handleRootChange('taxRate', parseFloat(e.target.value) || 0)}
                      className="w-10 bg-transparent border-none text-right focus:ring-0 p-0 text-xs"
                    />
                    <span className="text-xs ml-1">%</span>
                  </div>
                </div>
                <span className="font-medium">{invoice.currencySymbol}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-4 text-xl font-bold text-gray-900 border-t-2 border-gray-800 mt-2">
                <span>Total</span>
                <span>{invoice.currencySymbol}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 rounded-lg p-6 print:bg-gray-50 print:break-inside-avoid print:border print:border-gray-200">
            <div className="flex items-center mb-4 text-gray-800">
              <CreditCard size={20} className="mr-2" />
              <h3 className="font-bold uppercase tracking-wide">Payment Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div className="space-y-2">
                <div className="grid grid-cols-3 items-center">
                  <span className="font-medium">Bank Name:</span>
                  <input
                    type="text"
                    value={invoice.paymentInfo.bankName}
                    onChange={(e) => handleInputChange('paymentInfo', 'bankName', e.target.value)}
                    className="col-span-2 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:ring-0 text-sm py-0"
                  />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <span className="font-medium">Account Name:</span>
                  <input
                    type="text"
                    value={invoice.paymentInfo.accountName}
                    onChange={(e) => handleInputChange('paymentInfo', 'accountName', e.target.value)}
                    className="col-span-2 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:ring-0 text-sm py-0"
                  />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <span className="font-medium">UPI ID:</span>
                  <input
                    type="text"
                    value={invoice.paymentInfo.upiId}
                    onChange={(e) => handleInputChange('paymentInfo', 'upiId', e.target.value)}
                    className="col-span-2 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:ring-0 text-sm py-0 font-medium text-gray-800"
                    placeholder="username@upi"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-3 items-center">
                  <span className="font-medium">Account No:</span>
                  <input
                    type="text"
                    value={invoice.paymentInfo.accountNumber}
                    onChange={(e) => handleInputChange('paymentInfo', 'accountNumber', e.target.value)}
                    className="col-span-2 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:ring-0 text-sm py-0"
                  />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <select
                    value={invoice.paymentInfo.codeType}
                    onChange={(e) => handleInputChange('paymentInfo', 'codeType', e.target.value)}
                    className="font-medium bg-transparent border-none p-0 focus:ring-0 text-gray-700 cursor-pointer w-full text-sm -ml-1"
                  >
                    <option value="IFSC">IFSC Code:</option>
                    <option value="SWIFT">SWIFT Code:</option>
                    <option value="IBAN">IBAN:</option>
                    <option value="Routing">Routing No:</option>
                  </select>
                  <input
                    type="text"
                    value={invoice.paymentInfo.swiftCode}
                    onChange={(e) => handleInputChange('paymentInfo', 'swiftCode', e.target.value)}
                    className="col-span-2 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:ring-0 text-sm py-0"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Additional Notes / Payment Instructions</label>
              <textarea
                value={invoice.paymentInfo.notes}
                onChange={(e) => handleInputChange('paymentInfo', 'notes', e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-gray-600 resize-none"
                rows={2}
                placeholder="E.g. Payment due within 14 days. Thank you for your business!"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 print:mt-6 text-center text-gray-400 text-xs">
            <p>Thank you for your business.</p>
          </div>

        </div>
      </div>

      {/* Print Styles Injection */}
      <style>{`
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}

function App() {

  return (
    <>
      <InvoiceGenerator />
    </>
  )
}

export default App
