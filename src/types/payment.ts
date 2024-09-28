export interface Payment {
  userId: number;
  name: string;
  amount: number;
  currency: number;
  dueDate: Date;
  status: string;
  paymentDate?: Date;
}

export interface PaymentsQuery {
  page?: string;
  pageSize?: string;
  status?: string;
  currency?: string;
  userId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}