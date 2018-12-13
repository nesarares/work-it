export interface Message {
  header: string;
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
