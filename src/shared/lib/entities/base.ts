import { v4 as uuidv4 } from "uuid";

export abstract class Base {
  id: string;
  created_at: Date;

  constructor(id?: string, createdAt?: Date) {
    this.id = id ?? uuidv4();
    this.created_at = createdAt ?? new Date();
  }
}
