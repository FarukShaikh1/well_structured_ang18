@Injectable({ providedIn: 'root' })
export class TransactionService {
  private base = '/api/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.base);
  }

  addTransaction(t: TransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.base, t);
  }

  // Add edit/delete as needed
}
