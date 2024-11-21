import React, { useEffect, useState } from 'react';
import { fetchData, postUrl } from './services/api';
import './App.css';
import URLInputList from './components/URLInputList';
import FilterSection from './components/FilterSection';
import MediaGrid from './components/MediaGrid';
import Pagination from './components/Pagination';

interface DataRow {
    id: string;
    url: string;
    isImage: boolean;
    createdAt: string;
}

const App: React.FC = () => {
    const [data, setData] = useState<DataRow[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        isImage: undefined as boolean | undefined,
        search: '',
    });
    const [urlList, setUrlList] = useState<string[]>(['']);

    useEffect(() => {
        fetchDataFromApi();
    }, [currentPage, filters]);

    const fetchDataFromApi = async () => {
        try {
            const response = await fetchData({
                page: currentPage,
                limit: 12,
                ...filters,
            });

            setData(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmitUrls = async () => {
        const validUrls = urlList.filter((url) => url.trim() !== '');
        if (validUrls.length === 0) {
            alert('Please enter at least one valid URL.');
            return;
        }

        try {
            await postUrl(validUrls);
            setUrlList(['']);
            fetchDataFromApi();
        } catch (error) {
            console.error('Error submitting URLs:', error);
            alert('Failed to submit URLs.');
        }
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Media Scraper</h1>

            <URLInputList
                urlList={urlList}
                setUrlList={setUrlList}
                handleSubmitUrls={handleSubmitUrls}
            />

            <FilterSection filters={filters} setFilters={setFilters} fetchData={fetchDataFromApi} />

            <MediaGrid data={data} />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default App;
