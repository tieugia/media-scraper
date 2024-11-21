import React from 'react';

interface MediaGridProps {
    data: { id: string; url: string; isImage: boolean }[];
}

const MediaGrid: React.FC<MediaGridProps> = ({ data }) => {
    return (
        <div className="grid-container">
            {data.map((item) => (
                <div key={item.id} className="grid-item">
                    {item.isImage ? (
                        <img src={item.url} alt="Media" className="grid-image" />
                    ) : (
                        <video src={item.url} controls className="grid-video" />
                    )}
                </div>
            ))}
        </div>
    );
};

export default MediaGrid;
