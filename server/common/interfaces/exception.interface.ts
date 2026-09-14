export class BusinessException extends Error {
  code: number;
  status: number;

  constructor(message: string, code = 40000, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
