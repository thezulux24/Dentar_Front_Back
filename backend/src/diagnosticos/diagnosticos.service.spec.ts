import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticosService } from './diagnosticos.service';

describe('DiagnosticosService', () => {
  let service: DiagnosticosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiagnosticosService],
    }).compile();

    service = module.get<DiagnosticosService>(DiagnosticosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
