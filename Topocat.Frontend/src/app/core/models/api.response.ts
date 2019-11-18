export class ApiResponse<T> {
    data: T;
    error: any;
    message: string;
    isSuccessful: boolean;
}
