export const formatPrice = (price: number) => {
    if (price >= 1000000000) {
        const billions = price / 1000000000;
        if (billions % 1 === 0) {
            return `${billions} tỷ`;
        }
        return `${billions.toFixed(1)} tỷ`;
    }

    if (price >= 1000000) {
        const millions = price / 1000000;
        if (millions % 1 === 0) {
            return `${millions} triệu`;
        }
        return `${millions.toFixed(1)} triệu`;
    }

    if (price >= 1000) {
        const thousands = price / 1000;
        if (thousands % 1 === 0) {
            return `${thousands} nghìn`;
        }
        return `${thousands.toFixed(1)} nghìn`;
    }

    return `${price}`;
};

export const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
    return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
};

export const formatArea = (area: number) => {
    return `${area} m²`;
};