import { Base } from "@/shared/lib/entities/base";

export class Appointment extends Base {
  user_id: string;
  start_time: Date;
  end_time: Date;
  type: "virtual" | "in-person";
  link?: string;

  constructor({
    id,
    created_at,
    user_id,
    start_time,
    end_time,
    type,
    link,
  }: {
    id?: string;
    created_at?: Date;
    user_id: string;
    start_time: Date;
    end_time: Date;
    type: "virtual" | "in-person";
    link?: string;
  }) {
    super(id, created_at);
    this.user_id = user_id;
    this.start_time = start_time;
    this.end_time = end_time;
    this.type = type;
    this.link = link;
  }

  toObject() {
    return {
      id: this.id,
      created_at: this.created_at,
      user_id: this.user_id,
      start_time: this.start_time,
      end_time: this.end_time,
      type: this.type,
      link: this.link,
    };
  }
}
