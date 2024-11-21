import React from 'react';

interface FilterSectionProps {
    filters: { isImage: boolean | undefined; search: string };
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    fetchData: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, setFilters, fetchData }) => {
    const handleSearch = () => {
        fetchData();
    };

    return (
        <div className="filter-container">
            <h2 className="section-title">Filters</h2>
            <div className="filter-inputs">
                <select
                    name="isImage"
                    onChange={(e) =>
                        setFilters((prev: any) => ({
                            ...prev,
                            isImage: e.target.value === '' ? undefined : e.target.value === 'true',
                        }))
                    }
                    defaultValue=""
                    className="select-field"
                >
                    <option value="">All</option>
                    <option value="true">Images</option>
                    <option value="false">Videos</option>
                </select>
                <input
                    type="text"
                    placeholder="Search by URL"
                    onChange={(e) =>
                        setFilters((prev: any) => ({
                            ...prev,
                            search: e.target.value,
                        }))
                    }
                    className="input-field"
                />
                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
            </div>
        </div>
    );
};

export default FilterSection;
