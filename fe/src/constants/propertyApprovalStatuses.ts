import type {PropertyApprovalStatus} from "@/types/property-approval-status";

export const PROPERTY_APPROVAL_STATUSES: PropertyApprovalStatus[] = [
    {id: 'PENDING', name: 'Chờ duyệt'},
    {id: 'APPROVED', name: 'Đã duyệt'},
    {id: 'REJECTED', name: 'Không duyệt'},
];