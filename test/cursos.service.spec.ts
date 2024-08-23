import { Test, TestingModule } from '@nestjs/testing';
import { CursosService } from '../src/application/services/cursos.service';
import { CursosRepository } from '../src/repositories/infrastructure/cursos.repository';
import { AlunoRepository } from '../src/repositories/infrastructure/alunos.repository';
import { PresencaRepository } from '../src/repositories/infrastructure/presenca.repository';
import { Curso } from '../src/domain/entities/cursos.entity';
import { Aluno } from '../src/domain/entities/aluno.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('CursosService', () => {
  let service: CursosService;

  const mockCursosRepository = {
    buscarPorId: jest.fn(),
    salvar: jest.fn(),
  };

  const mockAlunoRepository = {
    listar: jest.fn(),
    salvar: jest.fn(),
  };

  const mockPresencaRepository = {
    
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CursosService,
        { provide: CursosRepository, useValue: mockCursosRepository },
        { provide: AlunoRepository, useValue: mockAlunoRepository },
        { provide: PresencaRepository, useValue: mockPresencaRepository }, 
      ],
    }).compile();

    service = module.get<CursosService>(CursosService);
  });

  it('deve adicionar um aluno a um curso', async () => {
    const cursoId = 'curso-id';
    const alunoId = 'aluno-id';

    const curso = new Curso({
      id: cursoId,
      nome: 'Javascript/AWS',
      duracao: 60,
      alunos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const aluno = new Aluno({
      id: alunoId,
      nome: 'Hilana Silva',
      email: 'hilana@outlook.com',
      curso: 'Javascript/AWS',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockCursosRepository.buscarPorId.mockResolvedValue(curso);
    mockAlunoRepository.listar.mockReturnValue([aluno]);
    mockCursosRepository.salvar.mockResolvedValue({
      ...curso,
      alunos: [aluno],
    });
    mockAlunoRepository.salvar.mockResolvedValue({
      ...aluno,
      curso: 'Javascript/AWS',
    });

    const resultado = await service.cadastrarAlunoEmCurso(alunoId, cursoId);

    expect(resultado.alunos).toContainEqual(aluno);
    expect(resultado.alunos.length).toBe(1);
    expect(mockCursosRepository.buscarPorId).toHaveBeenCalledWith(cursoId);
    expect(mockAlunoRepository.listar).toHaveBeenCalled();
    expect(mockCursosRepository.salvar).toHaveBeenCalledWith({
      ...curso,
      alunos: [aluno],
    });
    expect(mockAlunoRepository.salvar).toHaveBeenCalledWith({
      ...aluno,
      curso: 'Javascript/AWS',
    });
  });

  it('deve lançar NotFoundException se o curso não for encontrado', async () => {
    const cursoId = 'curso-id';
    const alunoId = 'aluno-id';

    mockCursosRepository.buscarPorId.mockResolvedValue(null);

    await expect(service.cadastrarAlunoEmCurso(alunoId, cursoId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar NotFoundException se o aluno não for encontrado', async () => {
    const cursoId = 'curso-id';
    const alunoId = 'aluno-id';

    const curso = new Curso({
      id: cursoId,
      nome: 'Javascript/AWS',
      duracao: 60,
      alunos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockCursosRepository.buscarPorId.mockResolvedValue(curso);
    mockAlunoRepository.listar.mockReturnValue([]);

    await expect(service.cadastrarAlunoEmCurso(alunoId, cursoId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar ConflictException se o aluno já estiver matriculado no curso', async () => {
    const cursoId = 'curso-id';
    const alunoId = 'aluno-id';

    const curso = new Curso({
      id: cursoId,
      nome: 'Javascript/AWS',
      duracao: 60,
      alunos: [
        new Aluno({
          id: alunoId,
          nome: 'Hilana Silva',
          email: 'hilana@outlook.com',
          curso: 'Javascript/AWS',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const aluno = new Aluno({
      id: alunoId,
      nome: 'Hilana Silva',
      email: 'hilana@outlook.com',
      curso: 'Javascript/AWS',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockCursosRepository.buscarPorId.mockResolvedValue(curso);
    mockAlunoRepository.listar.mockReturnValue([aluno]);

    await expect(service.cadastrarAlunoEmCurso(alunoId, cursoId)).rejects.toThrow(
      ConflictException,
    );
  });
});