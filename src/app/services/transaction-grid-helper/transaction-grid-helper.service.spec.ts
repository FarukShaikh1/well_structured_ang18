import { TestBed } from '@angular/core/testing';

import { TransactionGridHelperService } from './transaction-grid-helper.service';

describe('TransactionGridHelperService', () => {
  let service: TransactionGridHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionGridHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
