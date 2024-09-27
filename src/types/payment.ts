export interface Payment {
  userId: number;
  name: string;
  amount: number;
  currency: number;
  dueDate: Date;
  status: string;
  paymentDate?: Date;
}
