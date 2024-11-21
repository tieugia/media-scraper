import React from 'react';

interface URLInputListProps {
    urlList: string[];
    setUrlList: React.Dispatch<React.SetStateAction<string[]>>;
    handleSubmitUrls: () => void;
}

const URLInputList: React.FC<URLInputListProps> = ({ urlList, setUrlList, handleSubmitUrls }) => {
    const handleAddInput = () => {
        setUrlList((prev) => [...prev, '']);
    };

    const handleRemoveInput = (index: number) => {
        setUrlList((prev) => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = (index: number, value: string) => {
        setUrlList((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    return (
        <div className="submit-container">
            <h2 className="section-title">Add URLs</h2>
            {urlList.map((url, index) => (
                <div key={index} className="url-input-container">
                    <input
                        type="text"
                        placeholder={`Enter URL ${index + 1}`}
                        value={url}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="input-field"                        
                    />
                    <button
                        className="remove-button"
                        onClick={() => handleRemoveInput(index)}
                        disabled={urlList.length === 1}
                    >
                        ✕
                    </button>
                </div>
            ))}
            <div className="button-container">
                <button onClick={handleAddInput} className="add-button">
                    + Add URL
                </button>
                <button onClick={handleSubmitUrls} className="submit-button">
                    Submit All
                </button>
            </div>
        </div>
    );
};

export default URLInputList;
