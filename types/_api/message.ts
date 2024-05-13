export interface Message {
  id: number;
  from_user_id: number;
  to_user_id: number;
  type: number;
  content: string;
  is_read: number;
  create_time: string;
}
