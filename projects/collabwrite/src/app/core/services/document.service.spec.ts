import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DocumentsService } from './documents.service';
import { DocumentDto, Visibility } from '../../models/documents.dto';
import { environment } from '../../../environments/environment';

let httpMock: HttpTestingController;
const base = environment.apiUrl + '/documents';
const mockDocument: DocumentDto = {
  id: 1,
  title: 'Documento de teste',
  visibility: 'PUBLIC',
  contentDelta: { ops: [{ insert: 'Olá mundo\n' }] },
  contentHtml: '<p>Olá mundo</p>',
  createdAt: '2025-11-19T19:00:00.000Z',
  updatedAt: '2025-11-19T19:00:00.000Z',
  src: 'collabwrite',
  author: {
    id: 42,
    name: 'Usuário Teste',
  },
};
describe('DocumentSerivce', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentsService],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  function createService(): DocumentsService {
    return TestBed.inject(DocumentsService);
  }

  it('deve criar um documento', () => {
    const mockRequest: {
      title: string;
      visibility: Visibility;
      delta: unknown;
      html: string;
    } = {
      title: 'Documento de teste',
      visibility: 'PUBLIC',
      delta: { ops: [{ insert: 'Olá mundo\n' }] },
      html: '<p>Olá mundo</p>',
    };
    let resultadoDoTeste: DocumentDto | undefined;
    const service = createService();

    service.create(mockRequest).subscribe((response) => {
      resultadoDoTeste = response;
    });

    const req = httpMock.expectOne(`${base}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);

    req.flush(mockDocument);

    expect(resultadoDoTeste).toEqual(mockDocument);
  });

  it('deve gerar um link compartilhado', () => {
    const service = createService();
    const link: { link: string } = {
      link: 'https://collabwrite.com.br/share/efbf5380-bb2d-4761-8484-ba9b3ed75b68',
    };
    let mockLink: { link: string } = { link: '' };

    service.generateShareLink(1).subscribe((response) => {
      mockLink = response;
    });
    const req = httpMock.expectOne(`${base}/1/share/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    req.flush(link);
    expect(mockLink).toEqual(link);
  });

  it('deve receber lista de documentos', () => {
    const service = TestBed.inject(DocumentsService);
    let resultadoteste: DocumentDto[] = [];
    service.getFiles().subscribe((response) => {
      resultadoteste = response;
    });

    const req = httpMock.expectOne(`${base}/mine`);
    expect(req.request.method).toBe('GET');
    req.flush([mockDocument]);
    expect(resultadoteste).toEqual([mockDocument]);
  });
});
