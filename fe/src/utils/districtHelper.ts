import { DISTRICTS } from '@/constants/districts.ts';
import type { District } from '@/types/district.d.ts';

function normalize(str: string): string {
    return str
        .toLowerCase()               // chuyển về lowercase
        .trim()                      // bỏ khoảng trắng đầu/cuối
        .normalize("NFD")            // tách chữ & dấu
        .replace(/[\u0300-\u036f]/g, "") // xoá dấu tiếng Việt
        .replace(/[^a-z0-9\s]/g, "") // xoá ký tự đặc biệt
        .replace(/\s+/g, " ");       // chuẩn hoá nhiều spaces
}

/**
 * Lấy name (string hiển thị) từ id
 */
export function getDistrictNameById(id: District['id']): string | undefined {
    return DISTRICTS.find(d => d.id === id)?.name;
}

/**
 * Lấy id từ name
 */
export function getDistrictIdByName(name: string): string | undefined {
    const target = normalize(name);
    return DISTRICTS.find(d => normalize(d.name) === target)?.id;
}

/**
 * Kiểm tra id có hợp lệ hay không
 */
export function isValidDistrictId(id: string): boolean {
    return DISTRICTS.some(d => d.id === id);
}

/**
 * Kiểm tra name có hợp lệ hay không
 */
export function isValidDistrictName(name: string): boolean {
    return DISTRICTS.some(d => d.name === name);
}

/**
 * Lấy object District từ id
 */
export function getDistrictById(id: District['id']): District | undefined {
    return DISTRICTS.find(d => d.id === id);
}

export function convertDistrictToVN(input: string): string {
    if (!input) return input;

    const key = normalize(input);

    // District 1 -> District 12
    const districtNumberMatch = key.match(/^district (\d{1,2})$/);
    if (districtNumberMatch) {
        const num = Number(districtNumberMatch[1]);
        if (num >= 1 && num <= 12) {
            return `Quận ${num}`;
        }
    }

    const map: Record<string, string> = {
        // ===== QUẬN =====
        "binh thanh district": "Quận Bình Thạnh",
        "go vap district": "Quận Gò Vấp",
        "tan binh district": "Quận Tân Bình",
        "tan phu district": "Quận Tân Phú",
        "phu nhuan district": "Quận Phú Nhuận",
        "binh tan district": "Quận Bình Tân",

        // ===== HUYỆN =====
        "hoc mon district": "Huyện Hóc Môn",
        "cu chi district": "Huyện Củ Chi",
        "binh chanh district": "Huyện Bình Chánh",
        "nha be district": "Huyện Nhà Bè",
        "can gio district": "Huyện Cần Giờ",

        // ===== TP. THỦ ĐỨC =====
        "thu duc": "TP. Thủ Đức",
        "thu duc city": "TP. Thủ Đức",
        "thu duc district": "TP. Thủ Đức",
    };

    return map[key] ?? input;
}
