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
    if (!dateString) return '';
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

export const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatArea = (area: number) => {
    return `${area} m²`;
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export function formatPhoneNumber(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 10) return value;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export const formatMessageTime = (dateString: string) => {
    if (!dateString) return '';

    // Parse the date string as UTC
    // If the string doesn't end with 'Z', add it to ensure it's parsed as UTC
    let utcDateString = dateString;
    if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('T00:00:00')) {
        utcDateString = dateString + 'Z';
    }

    const date = new Date(utcDateString);
    const now = new Date();

    // Calculate difference in milliseconds using UTC time
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInSeconds / 3600);
    const diffInDays = Math.floor(diffInSeconds / 86400);

    // Vừa xong (less than 1 minute)
    if (diffInSeconds < 60) return 'Vừa xong';

    // X phút trước (less than 1 hour)
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    // X giờ trước (less than 24 hours)
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    // Convert to Vietnam timezone for display
    const vietnamDateStr = date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
    const vietnamDate = new Date(vietnamDateStr);
    const nowVietnamStr = now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
    const nowVietnam = new Date(nowVietnamStr);

    // Check if it's today (in Vietnam timezone)
    const isToday = vietnamDate.toDateString() === nowVietnam.toDateString();
    if (isToday) {
        const hours = String(vietnamDate.getHours()).padStart(2, '0');
        const minutes = String(vietnamDate.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Check if it's yesterday (in Vietnam timezone)
    const yesterday = new Date(nowVietnam);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = vietnamDate.toDateString() === yesterday.toDateString();
    if (isYesterday) {
        const hours = String(vietnamDate.getHours()).padStart(2, '0');
        const minutes = String(vietnamDate.getMinutes()).padStart(2, '0');
        return `Hôm qua ${hours}:${minutes}`;
    }

    // Check if within last 7 days - show day of week
    if (diffInDays < 7) {
        const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const hours = String(vietnamDate.getHours()).padStart(2, '0');
        const minutes = String(vietnamDate.getMinutes()).padStart(2, '0');
        return `${dayNames[vietnamDate.getDay()]} ${hours}:${minutes}`;
    }

    // For older messages, show date
    const day = String(vietnamDate.getDate()).padStart(2, '0');
    const month = String(vietnamDate.getMonth() + 1).padStart(2, '0');
    const year = vietnamDate.getFullYear();

    // If same year, don't show year
    if (vietnamDate.getFullYear() === nowVietnam.getFullYear()) {
        return `${day}/${month}`;
    }

    // Different year, show full date
    return `${day}/${month}/${year}`;
};
