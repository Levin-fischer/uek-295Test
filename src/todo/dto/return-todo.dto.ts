export class ReturnTodoDto {
  id: number;
  title: string;
  description: string;
  isClosed: boolean;
  userId: number;
  createdById: number | null;
  updatedById: number | null;
  createdAt: Date;
  updatedAt: Date;
}
