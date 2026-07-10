import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

type Item = {
  id: number;
  description: string;
  amount: number;
  unit: '$' | '%';
};

type RehabCostModalProps = {
  isOpen: boolean;
  title: string;
  initialData: number | Item[];
  onClose: () => void;
  onSave: (data: number | Item[]) => void;
};

const CostModal: React.FC<RehabCostModalProps> = ({
  isOpen,
  title,
  initialData,
  onClose,
  onSave,
}) => {
  const [itemize, setItemize] = useState(false);
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<'$' | '%'>('$');
  const [items, setItems] = useState<Item[]>([]);
  const [errors, setErrors] = useState<string | null>(null);

   

  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      setItemize(true);
      setItems(initialData);
    } else {
      setItemize(false);
      setAmount(initialData?.toString() || '');
      setUnit('$');
      setItems([]); // Clear items if switching from itemized to non-itemized
    }
  }, [initialData]);
  useEffect(() => {
    if (itemize && items.length === 0) {
      setItems([{ id: Date.now(), description: '', amount: 0, unit: '$' }]);
    }
  }, [itemize]);
  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: '', amount: 0, unit: '$' },
    ]);
  };

  const handleItemChange = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const validate = (): boolean => {
    if (!itemize) {
      if (amount === '' || isNaN(Number(amount)) || Number(amount) <= 0) {
        setErrors('Please enter a valid amount.');
        return false;
      }
    } else {
      for (let item of items) {
        if (!item.description.trim()) {
          setErrors('Each item must have a description.');
          return false;
        }
        if (isNaN(Number(item.amount)) || Number(item.amount) <= 0) {
          setErrors('Each item must have a positive amount.');
          return false;
        }
      }
    }
    setErrors(null);
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (itemize) {
      onSave(items);
    } else {
      onSave(Number(amount));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>

          {/* Custom Toggle */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">Itemize</span>
            <div
              onClick={() => setItemize(!itemize)}
              className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                itemize ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                  itemize ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="text-sm">{itemize ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {/* Error message */}
        {errors && <p className="text-red-500 mb-2">{errors}</p>}

        {!itemize ? (
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="number"
              placeholder="Enter Amount..."
              className="flex-1 border border-gray-300 p-2 rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select
              className="border p-2 rounded"
              value={unit}
              onChange={(e) => setUnit(e.target.value as '$' | '%')}
            >
              <option value="$">$</option>
              <option value="%">%</option>
            </select>
          </div>
        ) : (
          <div className="space-y-4 mb-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="Description"
                  className="flex-1 border p-2 rounded"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(item.id, 'description', e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-24 border p-2 rounded"
                  value={item.amount}
                  onChange={(e) =>
                    handleItemChange(item.id, 'amount', Number(e.target.value))
                  }
                />
                <select
                  className="border p-2 rounded"
                  value={item.unit}
                  onChange={(e) =>
                    handleItemChange(item.id, 'unit', e.target.value as '$' | '%')
                  }
                >
                  <option value="$">$</option>
                  <option value="%">%</option>
                </select>
                {items.length > 1 && (
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddItem}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Description
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostModal;
