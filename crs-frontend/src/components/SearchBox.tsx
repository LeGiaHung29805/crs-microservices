import { useState, useEffect, useRef } from 'react';

interface SearchBoxProps {
    onSearch: (keyword: string) => void;
    placeholder?: string;
}

export default function SearchBox({ onSearch, placeholder }: SearchBoxProps) {
    const [inputValue, setInputValue] = useState('');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            onSearch(inputValue.trim());
        }, 400);

        return () => clearTimeout(timer);
    }, [inputValue, onSearch]);

    return (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder ?? 'Tìm kiếm theo tên môn học...'}
                style={{
                    width: '100%',
                    maxWidth: 400,
                    padding: '8px 12px',
                    fontSize: 14,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    textAlign: 'center'
                }}
            />
        </div>
    );
}
