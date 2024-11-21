import { DataTypes, Model } from 'sequelize';
import { sequelize } from './database';

class MediaModel extends Model {}

MediaModel.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        webUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isImage: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE
        },
    },
    {
        sequelize,
        tableName: 'media',
        timestamps: false
    }
);

export { MediaModel };
